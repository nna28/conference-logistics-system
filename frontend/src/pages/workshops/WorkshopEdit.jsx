import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import workshopService from "../../services/workshopService";

import WorkshopForm from "../../components/workshop/WorkshopForm";
import BackButton from "../../components/layout/BackButton";

function WorkshopEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const load = async () => {
      const data = await workshopService.getById(id);
      setFormData(data);
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Nên có loading state ở đây nếu bạn muốn, ví dụ: setLoading(true);
    
    try {
      // Gọi API cập nhật
      await workshopService.update(id, formData); // Hoặc tên biến data của bạn
      
      alert("Cập nhật Khóa học thành công!");
      navigate("/workshops"); // Quay về danh sách
      
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("Lỗi: Bạn không có quyền chỉnh sửa Khóa học này!");
      } else {
        alert("Lỗi khi lưu: " + (error.response?.data?.detail || error.message));
      }
      console.error("Lỗi cập nhật:", error);
    } finally {
      // setLoading(false);
    }
  };
  return (
    <>
      <BackButton />

      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div className="page-header-left">
          <p className="page-subtitle">Workshop</p>
          <h1>Edit Workshop</h1>
        </div>
      </div>

      <WorkshopForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitText="Update Workshop"
        isEdit={true}
      />
    </>
  );
}

export default WorkshopEdit;