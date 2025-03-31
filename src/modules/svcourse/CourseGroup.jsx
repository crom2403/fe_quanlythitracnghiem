import { Input,Button } from "@mui/material"
import { HiOutlineSearch } from "react-icons/hi";
const CourseGroup = () => {
  return (
    <div
    className="w-full min-h-screen flex flex-col bg-gray-100"
    style={{ fontFamily: "PlayFair Display" }}
  >
    <div className="relative flex flex-row items-center justify-between w-full max-w-[24rem] mt-8 gap-4">
    <Input
          type="text"
          placeholder="Nhập tên lớp"
          className="border border-gray-300 rounded-md p-2 w-full"
          style={{
            height: "40px", // Đặt chiều cao cho Input
            fontSize: "16px", // Kích thước chữ đồng đều
          }}
        />
        <Button
          variant="contained"
          color="primary"
          className="flex items-center gap-2 px-4"
          style={{
            height: "40px", // Đặt chiều cao giống Input
            backgroundColor: "#1976d2", // Màu xanh đậm
            color: "#fff", // Màu chữ trắng
            textTransform: "none", // Không viết hoa toàn bộ chữ
            fontSize: "16px", // Kích thước chữ đồng đều
          }}
        >
          <HiOutlineSearch size={20} />
        </Button>
    </div>
  </div>
  )
}

export default CourseGroup