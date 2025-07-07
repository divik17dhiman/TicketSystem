import React, { useState } from 'react';
import ApiService from '../services/api';
import ImageModal from './ImageModal';
import { getImageUrl } from '../utils/api';

const ImageUpload = ({ onImagesUploaded, multiple = false, existingImages = [] }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState(existingImages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      let uploadedData;
      if (multiple && files.length > 1) {
        uploadedData = await ApiService.uploadImages(files);
      } else {
        uploadedData = await ApiService.uploadImage(files[0]);
        uploadedData = [uploadedData]; // Normalize to array
      }

      const newImages = [...uploadedImages, ...uploadedData];
      setUploadedImages(newImages);
      onImagesUploaded(newImages);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image(s): ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    onImagesUploaded(newImages);
  };

  const openImageModal = (index) => {
    setModalCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="image-upload">
      <div className="form-group">
        <label>
          {multiple ? 'Upload Images (max 5)' : 'Upload Image'}
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileChange}
            disabled={uploading}
            style={{ marginTop: '0.5rem' }}
          />
        </label>
        {uploading && <p>Uploading...</p>}
      </div>

      {uploadedImages.length > 0 && (
        <div className="uploaded-images">
          <h4>Uploaded Images:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {uploadedImages.map((image, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={getImageUrl(image.url)}
                  alt={image.originalName}
                  onClick={() => openImageModal(index)}
                  style={{
                    width: '100%',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        images={uploadedImages}
        currentIndex={modalCurrentIndex}
        isOpen={isModalOpen}
        onClose={closeImageModal}
      />
    </div>
  );
};

export default ImageUpload;
