/**
 * Bharathi Thervukalam - User-Friendly SweetAlert2 Configuration & Animations
 * Globally configures SweetAlert2 with buttery-smooth physics-based easing,
 * soft glassmorphism backdrops, and modern micro-interactions for all exams & pages.
 */

import Swal from 'sweetalert2';

// Configure global default parameters for all SweetAlert2 instances across the app
// Every `Swal.fire()` call across student exams, OMR simulator, admin, and portal pages
// will automatically inherit these user-friendly animations and styling.
const defaultSwalParams = {
  customClass: {
    popup: 'swal2-user-friendly-popup',
    title: 'swal2-user-friendly-title',
    htmlContainer: 'swal2-user-friendly-content',
    confirmButton: 'swal2-user-friendly-confirm-btn',
    cancelButton: 'swal2-user-friendly-cancel-btn',
  },
  showClass: {
    popup: 'swal2-friendly-animate-in',
    backdrop: 'swal2-backdrop-friendly-in',
  },
  hideClass: {
    popup: 'swal2-friendly-animate-out',
    backdrop: 'swal2-backdrop-friendly-out',
  },
  buttonsStyling: true,
  backdrop: true,
  focusConfirm: false,
};

// Export pre-configured helper utilities with friendly feedback
export const friendlySwal = Swal.mixin(defaultSwalParams);

export const notifySuccess = (title, text, timer = 2000) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    timer,
    showConfirmButton: false,
    timerProgressBar: true,
    ...defaultSwalParams,
  });
};

export const notifyError = (title, text) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Acknowledge',
    ...defaultSwalParams,
  });
};

export const notifyWarning = (title, text) => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'Understood',
    ...defaultSwalParams,
  });
};

export const confirmExamAction = async (title, htmlText, confirmText = 'Yes, Proceed') => {
  return Swal.fire({
    title,
    html: htmlText,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel & Return',
    reverseButtons: true,
    ...defaultSwalParams,
  });
};

export default Swal;
