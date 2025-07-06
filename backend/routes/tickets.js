const express = require('express');
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  addComment,
  searchTickets
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getTickets)
  .post(protect, createTicket);

router.get('/search', protect, searchTickets);

router.route('/:id')
  .get(protect, getTicketById)
  .put(protect, updateTicket);

router.post('/:id/comments', protect, addComment);

module.exports = router;
