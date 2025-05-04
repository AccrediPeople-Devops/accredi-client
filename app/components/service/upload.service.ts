import axiosInstance from "../config/axiosInstance";

class UploadService {
  imageToFormData(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return formData;
  }

  async uploadImage(file: File) {
    const formData = this.imageToFormData(file);
    try {
      const res = await axiosInstance.post("/uploads/v1", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  async deleteImage(imagePath: string) {
    const res = await axiosInstance.delete(`/uploads/v1/${imagePath}`);
    return res.data;
  }
}

export default new UploadService();
