import Swal from 'sweetalert2';

export const successAlert = (message: string) => {
    Swal.fire({
        icon: "success",
        title: message,
        showConfirmButton: true
    });
}

export const errorAlert = (message: string) => {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        timer: 9000,
        text: message,
    });
}
