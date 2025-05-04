import React, { useState } from 'react';
import axios from 'axios';
import './Syllabus.css'
const NewPostForm = () => {
    const [formData, setFormData] = useState({
        namepost: '',
      
        paper: '',
        standard: '',
        pdf: null // Store file object here
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, pdf: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = new FormData();
        postData.append('namepost', formData.namepost);
      
        postData.append('paper', formData.paper);
        postData.append('standard', formData.standard);
        postData.append('file', formData.pdf); // Ensure 'file' matches backend expectation

        try {
            const response = await axios.post('https://www.bharathithervukalam.com/syllabus/upload', postData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Post created successfully:', response.data);
            alert('Post created successfully:');
            // Optionally, redirect or update state after successful creation
        } catch (error) {
            console.error('Error creating post:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
            }
            alert('Error creating post. Check console for details.');
        }
    };

    return (
        <div className="new-post-form mt-5">
            <form onSubmit={handleSubmit}>
                <input type="text" name="namepost" value={formData.namepost} onChange={handleChange} placeholder="Name" />
              
                <input type="text" name="paper" value={formData.paper} onChange={handleChange} placeholder="Paper" />
                <input type="text" name="standard" value={formData.standard} onChange={handleChange} placeholder="Standard" />
                <input type="file" name="pdf" onChange={handleFileChange} />

                <button type="submit">Submit</button>
            </form>

            <hr />
        </div>
    );
};

export default NewPostForm;
