import React from 'react';
import axios from 'axios';

const ExportPDFButton = () => {
  const handleExport = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users/export/pdf', {
        responseType: 'blob', // Important for handling binary data
      });

      // Create a URL for the blob and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.pdf'); 
      document.body.appendChild(link);
      link.click();
      
     
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export PDF', error);
    }
  };

  return (
    <button onClick={handleExport}>
      Export Users to PDF
    </button>
  );
};

export default ExportPDFButton;
