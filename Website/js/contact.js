// Contact Form Handler
// This script manages the contact form submission and file uploads

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const fileUpload = document.getElementById('fileUpload');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileList = document.getElementById('fileList');
    let selectedFiles = [];

    // Form Submission Handler
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate form
            if (!validateForm()) {
                return;
            }

            // Collect form data
            const formData = new FormData(contactForm);
            
            // Add files if any
            selectedFiles.forEach(file => {
                formData.append('files', file);
            });

            // For now, simulate submission (will be replaced with actual API call)
            await handleFormSubmission(formData);
        });
    }

    // File Upload Handlers
    if (fileUploadArea && fileUpload) {
        // Click to upload
        fileUploadArea.addEventListener('click', function() {
            fileUpload.click();
        });

        // File selection
        fileUpload.addEventListener('change', function(e) {
            handleFiles(e.target.files);
        });

        // Drag and drop
        fileUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#3498db';
        });

        fileUploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#dee2e6';
        });

        fileUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#dee2e6';
            handleFiles(e.dataTransfer.files);
        });
    }

    /**
     * Validate the contact form
     * @returns {boolean} Whether the form is valid
     */
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        // Name validation
        if (name.length < 2) {
            window.VIC.showAlert('Please enter a valid name', 'error');
            return false;
        }

        // Email validation
        if (!window.VIC.validateEmail(email)) {
            window.VIC.showAlert('Please enter a valid email address', 'error');
            return false;
        }

        // Phone validation (if provided)
        if (phone && !window.VIC.validatePhone(phone)) {
            window.VIC.showAlert('Please enter a valid phone number', 'error');
            return false;
        }

        // Subject validation
        if (!subject) {
            window.VIC.showAlert('Please select a subject', 'error');
            return false;
        }

        // Message validation
        if (message.length < 10) {
            window.VIC.showAlert('Please enter a message (at least 10 characters)', 'error');
            return false;
        }

        return true;
    }

    /**
     * Handle file selection
     * @param {FileList} files - Selected files
     */
    function handleFiles(files) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/pdf', 'application/msword', 
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'image/jpeg', 'image/jpg', 'image/png'];

        for (let file of files) {
            // Check file size
            if (file.size > maxSize) {
                window.VIC.showAlert(`File ${file.name} is too large. Maximum size is 5MB.`, 'error');
                continue;
            }

            // Check file type
            if (!allowedTypes.includes(file.type)) {
                window.VIC.showAlert(`File ${file.name} has an unsupported format.`, 'error');
                continue;
            }

            // Check if file already selected
            if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                window.VIC.showAlert(`File ${file.name} is already selected.`, 'error');
                continue;
            }

            selectedFiles.push(file);
        }

        updateFileList();
    }

    /**
     * Update the displayed file list
     */
    function updateFileList() {
        if (selectedFiles.length === 0) {
            fileList.innerHTML = '';
            return;
        }

        let html = '<div style="margin-top: 1rem;"><strong>Selected Files:</strong><ul style="margin-left: 1.5rem; margin-top: 0.5rem;">';
        
        selectedFiles.forEach((file, index) => {
            html += `
                <li style="margin: 0.5rem 0; display: flex; justify-content: space-between; align-items: center;">
                    <span>${file.name} (${window.VIC.formatFileSize(file.size)})</span>
                    <button type="button" onclick="removeFile(${index})" style="background: #e74c3c; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 3px; cursor: pointer;">Remove</button>
                </li>
            `;
        });
        
        html += '</ul></div>';
        fileList.innerHTML = html;
    }

    /**
     * Remove a file from the selection
     * @param {number} index - Index of the file to remove
     */
    window.removeFile = function(index) {
        selectedFiles.splice(index, 1);
        updateFileList();
    };

    /**
     * Handle form submission
     * @param {FormData} formData - The form data to submit
     */
    async function handleFormSubmission(formData) {
        // Show loading spinner
        window.VIC.toggleSpinner(true);
        contactForm.style.opacity = '0.5';
        contactForm.style.pointerEvents = 'none';

        try {
            // Simulate API call (replace this with actual API call when backend is ready)
            // await window.VIC.apiRequest('/contact', {
            //     method: 'POST',
            //     body: formData
            // });

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // For now, just log the data and show success message
            console.log('Form data:', Object.fromEntries(formData));
            console.log('Files:', selectedFiles);

            // Show success message
            window.VIC.showAlert('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success', 0);

            // Reset form
            contactForm.reset();
            selectedFiles = [];
            updateFileList();

            // Scroll to top to see the success message
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error('Form submission error:', error);
            window.VIC.showAlert('Sorry, there was an error sending your message. Please try again later.', 'error', 0);
        } finally {
            // Hide loading spinner
            window.VIC.toggleSpinner(false);
            contactForm.style.opacity = '1';
            contactForm.style.pointerEvents = 'auto';
        }
    }

    /**
     * Future: This function will handle actual API submission when backend is deployed
     * @param {FormData} formData - The form data
     */
    async function submitToAPI(formData) {
        // Convert FormData to JSON (except files)
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // If files are present, use multipart/form-data
        if (selectedFiles.length > 0) {
            return await window.VIC.apiRequest('/contact', {
                method: 'POST',
                body: formData,
                headers: {} // Remove Content-Type header to let browser set it for FormData
            });
        } else {
            // Otherwise, send JSON
            return await window.VIC.apiRequest('/contact', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        }
    }
});
