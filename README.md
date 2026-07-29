# BK-Sync - Hệ thống điểm danh thông minh bằng QR Code

Hệ thống điểm danh bằng QR Code động (chống điểm danh hộ) xây dựng trên kiến trúc AWS Serverless.

---

## 1. Công nghệ sử dụng (Tech Stack)

- **Backend:** AWS SAM, Node.js (TypeScript), AWS Lambda, API Gateway, DynamoDB.
- **Frontend:** React (Vite), Tailwind CSS.
- **Auth & CI/CD:** Amazon Cognito, AWS Amplify Hosting.

---

## 2. Chuẩn bị (Prerequisites)

Hãy đảm bảo máy tính của bạn đã cài đặt sẵn các công cụ sau:
- Node.js (v20+)
- Git
- AWS CLI (đã cấu hình `aws configure` với IAM User có đủ quyền deploy)
- AWS SAM CLI (`sam --version`)

---

## 3. Triển khai Backend (AWS SAM)

Khởi động Terminal và trỏ vào thư mục `backend`:

```bash
cd backend
npm install
sam build
sam deploy --guided
```

Khi được hỏi, hãy điền các thông số cơ bản:
- **Stack Name**: `qr-attendance-backend-dev`
- **AWS Region**: `ap-southeast-1`
- Các mục khác: Chọn `y` hoặc nhấn `Enter` để dùng mặc định.

**Lưu ý quan trọng:** Sau khi deploy thành công, hãy copy lại 3 giá trị ở bảng Outputs: `ApiEndpoint`, `UserPoolId`, `UserPoolClientId`.

---

## 4. Khởi tạo Tài khoản Admin

Chạy script có sẵn để tự động tạo tài khoản Admin phục vụ cho việc tạo lớp học sau này:

```bash
cd ../scripts
chmod +x create_admin.sh
./create_admin.sh
```

Làm theo hướng dẫn trên màn hình để nhập Email, Password và Họ tên.

---

## 5. Triển khai Frontend (AWS Amplify)

1. Tạo một repository mới trên GitHub cá nhân của bạn và push toàn bộ mã nguồn này lên đó.
2. Truy cập **AWS Amplify** trên giao diện Web Console -> **Create new app** -> Chọn **GitHub**.
3. Chọn repository và nhánh `main`. 
4. Tích chọn **Connecting a monorepo? Pick a folder** và nhập `frontend`.
5. Mở rộng phần **Advanced settings**, thêm 3 biến môi trường (Environment variables) lấy từ bước 3:
   - `VITE_API_ENDPOINT`
   - `VITE_USER_POOL_ID`
   - `VITE_USER_POOL_CLIENT_ID`
6. Bấm **Save and deploy**. Quá trình build mất khoảng 2 phút và bạn sẽ nhận được link truy cập ứng dụng.

---

## 6. Dọn dẹp hệ thống (Cleanup)

Để không bị AWS tính phí khi không sử dụng:
1. Xoá Frontend: Lên giao diện **AWS Amplify** -> App settings -> **Delete app**.
2. Xoá Backend: Mở Terminal ở thư mục `backend` và chạy lệnh:
   ```bash
   sam delete
   ```

## 7. Test

Link web: https://main.d135ukmg55jufb.amplifyapp.com/

Tài khoản Admin: admin@demo.com / Password123! 
