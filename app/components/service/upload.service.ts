import axiosInstance from "../config/axiosInstance";

class UploadService {
  fileToFormData(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return formData;
  }

  // Legacy method name for backward compatibility
  imageToFormData(file: File) {
    return this.fileToFormData(file);
  }

  async uploadFile(file: File) {
    const formData = this.fileToFormData(file);
    try {
      const res = await axiosInstance.post("/uploads/v1", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  // Legacy method name for backward compatibility
  async uploadImage(file: File) {
    return this.uploadFile(file);
  }

  async deleteImage(imagePath: string) {
    const res = await axiosInstance.delete(`/uploads/v1/${imagePath}`);
    return res.data;
  }
}

export default new UploadService();
