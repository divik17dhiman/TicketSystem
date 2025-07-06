const { Ticket, Comment } = require('../models');

const createTicket = async (req, res) => {
  try {
    console.log('Creating ticket for user:', req.user._id, req.user.name);
    const { title, description, category, priority, images } = req.body;
    
    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority,
      images: images || [],
      user: req.user._id
    });
    
    // Populate the user field before sending response
    await ticket.populate('user', 'name email');
    
    console.log('Ticket created successfully:', ticket._id);
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(400).json({ message: error.message });
  }
};

const getTickets = async (req, res) => {
  try {
    // Remove the logging that's causing terminal spam
    const query = req.user.role === 'customer' ? { user: req.user._id } : {};
    const tickets = await Ticket.find(query)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    
    // Remove this log: console.log(`Found ${tickets.length} tickets`);
    res.json(tickets);
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(400).json({ message: error.message });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('assignedTo', 'name email role')
      .populate('comments.user', 'name email role');
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Only customers are restricted to their own tickets
    if (req.user.role === 'customer' && ticket.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Remove excessive logging for normal operations
    res.json(ticket);
  } catch (error) {
    console.error('Get ticket by ID error:', error);
    res.status(400).json({ message: error.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    console.log('=== BACKEND UPDATE TICKET DEBUG ===');
    console.log('Ticket ID:', req.params.id);
    console.log('Update data:', req.body);
    console.log('User:', { id: req.user._id, role: req.user.role, name: req.user.name });

    const ticketId = req.params.id;
    
    // First, get the current ticket
    const currentTicket = await Ticket.findById(ticketId);
    if (!currentTicket) {
      console.log('❌ Ticket not found:', ticketId);
      return res.status(404).json({ message: 'Ticket not found' });
    }

    console.log('Current ticket status:', currentTicket.status);
    console.log('New status:', req.body.status);

    // Check authorization
    if (req.user.role === 'customer' && currentTicket.user.toString() !== req.user._id.toString()) {
      console.log('❌ Authorization failed - customer accessing other user ticket');
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Perform the update
    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      { ...req.body },
      { 
        new: true,
        runValidators: true
      }
    ).populate('user', 'name email role')
     .populate('assignedTo', 'name email role')
     .populate('comments.user', 'name email role');

    if (!updatedTicket) {
      console.log('❌ Failed to update ticket');
      return res.status(400).json({ message: 'Failed to update ticket' });
    }

    console.log('✅ Ticket updated successfully:');
    console.log('- ID:', updatedTicket._id);
    console.log('- Old status:', currentTicket.status);
    console.log('- New status:', updatedTicket.status);
    console.log('- Updated by:', req.user.name);

    // Verify the update worked by fetching again
    const verifyTicket = await Ticket.findById(ticketId);
    console.log('Verification - ticket status in DB:', verifyTicket.status);

    res.json(updatedTicket);
  } catch (error) {
    console.error('❌ Update ticket error:', error);
    res.status(400).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { message, images } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.comments.push({
      user: req.user._id,
      message,
      images: images || []
    });

    await ticket.save();
    
    // Populate the entire ticket with user data before sending response
    await ticket.populate([
      { path: 'user', select: 'name email role' },
      { path: 'assignedTo', select: 'name email role' },
      { path: 'comments.user', select: 'name email role' }
    ]);
    
    console.log('Comment added with images. Populated ticket:', JSON.stringify(ticket, null, 2));
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(400).json({ message: error.message });
  }
};

const searchTickets = async (req, res) => {
  try {
    const {
      search,
      priority,
      category,
      assignedTo,
      dateFrom,
      dateTo,
      sortBy = 'createdAt'
    } = req.query;

    // Build query based on user role
    let query = req.user.role === 'customer' ? { user: req.user._id } : {};

    // Add filters
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (assignedTo) {
      if (assignedTo === 'unassigned') {
        query.assignedTo = { $exists: false };
      } else {
        query.assignedTo = assignedTo;
      }
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo + 'T23:59:59');
    }

    // Build aggregation pipeline for text search
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'assignedTo'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$assignedTo',
          preserveNullAndEmptyArrays: true
        }
      }
    ];

    // Add text search if provided
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { 'user.name': { $regex: search, $options: 'i' } },
            { 'comments.message': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Add sorting
    const sortOptions = {
      latest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      priority: { priority: -1, createdAt: -1 },
      status: { status: 1, createdAt: -1 },
      comments: { 'commentsCount': -1, createdAt: -1 }
    };

    if (sortBy === 'comments') {
      pipeline.push({
        $addFields: {
          commentsCount: { $size: { $ifNull: ['$comments', []] } }
        }
      });
    }

    pipeline.push({ $sort: sortOptions[sortBy] || sortOptions.latest });

    const tickets = await Ticket.aggregate(pipeline);

    res.json(tickets);
  } catch (error) {
    console.error('Search tickets error:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  addComment,
  searchTickets
};
