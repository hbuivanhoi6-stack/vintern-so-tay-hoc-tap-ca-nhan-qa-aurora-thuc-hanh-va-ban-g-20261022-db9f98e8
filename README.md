# Notes — bài thực hành giả lập để nghiệm thu V-INTERN

Đây là sản phẩm ghi chú dùng dữ liệu tổng hợp để kiểm tra luồng sinh viên nộp PR, AI nhận xét, runner thực thi và giảng viên chốt kết quả. Không có sinh viên thật được đánh giá trong repository này.

## Chạy và kiểm tra

Cần Node.js 22 trở lên. Chạy trong thư mục chứa package.json:

```sh
npm install
npm run dev
npm test
npm run build
```

`npm test` chạy tám kiểm thử của model bằng Node Test Runner; bản thân các test này không cần cài thư viện. Runner V-INTERN chạy bộ kiểm tra riêng được duyệt bên ngoài repository, trên đúng SHA của bài nộp.

## Trải nghiệm các luồng

1. Bấm **New note**, nhập Title, Content và các Tags ngăn bằng dấu phẩy, rồi bấm Save. Tiêu đề trống bị chặn; lỗi không làm mất bản nháp.
2. Bấm Edit tại ghi chú, sửa và lưu. ID và thời điểm tạo được giữ; thời điểm cập nhật đổi. Tải lại trang để kiểm tra lưu trữ.
3. Nhập Search và Filter by exact tag. Hai điều kiện kết hợp với nhau. Khi không có kết quả, giao diện chỉ cách bỏ bộ lọc; khi chưa có ghi chú, giao diện hướng dẫn tạo mới.
4. Bấm Delete: Cancel giữ dữ liệu, xác nhận mới xóa. Tải lại trang để đối chiếu.
5. Bấm Export JSON để tải `notes-v1.json`. Phần xem trước hiển thị đúng dữ liệu xuất. Object có `schemaVersion: 1` và mảng `notes`.

## Source và dữ liệu

| File | Trách nhiệm |
|---|---|
| src/main.tsx | Form, danh sách, lưu trữ, tìm kiếm, xóa có xác nhận, xuất JSON |
| src/model.js | Validate và mã hóa schema, tạo/sửa Note, kết hợp bộ lọc |
| src/model.test.js | Tám ca kiểm thử cho model và dữ liệu lỗi |

Note chứa id, title, content, tags, createdAt và updatedAt. Dữ liệu nằm ở localStorage của trình duyệt, khóa `vintern.qa.notes.v1`. Không cần API, tài khoản đăng nhập hoặc biến môi trường. Nội dung ghi chú được render thành text; ứng dụng không chạy HTML/script từ nội dung.

Nếu JSON/schema lưu trữ bị hỏng, ứng dụng giữ nguyên dữ liệu gốc và khóa thao tác ghi để tránh ghi đè. Nếu bị hết quota, form giữ bản nháp và hiện thông báo. Đây là ứng dụng học tập local: không có đồng bộ cloud hoặc khôi phục dữ liệu trên máy khác. Cần tự giữ bản JSON xuất nếu muốn lưu dự phòng.

## Bằng chứng cần đối chiếu khi bàn giao

Mỗi PR gắn với một nhiệm vụ. Kiểm tra commit SHA, kết quả từng check của runner và phản hồi giảng viên trong V-INTERN. Kết quả AI chỉ là gợi ý; chạy unit test của repository không thay thế kiểm thử tin cậy và quyết định của giảng viên.
