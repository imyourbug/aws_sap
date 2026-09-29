# AWS SAP-C02: Tổng hợp chủ đề làm sai và lộ trình ôn tập

> Nguồn: 12 file JSON trong `~/Desktop/aws` (1.json → 12.json), tạo ngày 2026-09-28.

---

## 1. Tổng quan

| Chỉ số | Giá trị |
|---|---|
| Tổng số câu sai (không trùng) | **315** |
| Câu sai cả 2 lần làm | **10** ⚠️ |
| Câu từng sai nhưng lần gần nhất đã đúng | 4 |
| Số bộ đề nguồn | 12 (Internet - 1: 32, Internet - 2: 26, Internet - 3: 19, Internet - 4: 24, Internet - 5: 32, Internet - 6: 34, Internet - 7: 23, JBS - 3: 22, JBS - 4: 29, SPM - 1: 34, SPM - 2: 33, SPM - 3: 7) |


### Phân bố theo topic

Mỗi câu được xếp vào **1 topic chính**. Cột "Có liên quan" đếm mọi câu có dính tới topic đó, vì nhiều câu SAP trải qua 2–3 mảng cùng lúc.

| # | Topic | Câu sai (chính) | % | Có liên quan | Ưu tiên | Mục |
|---|---|---|---|---|---|---|
| 1 | Storage (S3/EFS/FSx/Gateway/EBS) | 47 | 15% | 98 | 🔴 Rất cao | 3.5 |
| 2 | Serverless, Containers & Integration | 38 | 12% | 77 | 🔴 Rất cao | 3.8 |
| 3 | Hybrid & VPC Networking | 40 | 13% | 65 | 🔴 Rất cao | 3.1 |
| 4 | Databases (RDS/Aurora/DynamoDB/Cache/Redshift) | 29 | 9% | 68 | 🟠 Cao | 3.6 |
| 5 | Multi-account Governance & IAM | 35 | 11% | 53 | 🟠 Cao | 3.3 |
| 6 | IaC, Deployment & Operations | 22 | 7% | 73 | 🟠 Cao | 3.10 |
| 7 | Security, Encryption & Compliance | 26 | 8% | 63 | 🟠 Cao | 3.4 |
| 8 | Route 53, CloudFront & Edge | 26 | 8% | 46 | 🟡 Trung bình | 3.2 |
| 9 | Migration & Transfer | 20 | 6% | 54 | 🟡 Trung bình | 3.9 |
| 10 | Analytics, Streaming & IoT | 16 | 5% | 31 | 🟡 Trung bình | 3.7 |
| 11 | Cost Optimization & Billing | 12 | 4% | 21 | 🟢 Vừa | 3.11 |
| 12 | DR, HA & Backup | 3 | 1% | 25 | 🟢 Vừa | 3.12 |


**Nhận xét nhanh:**
- Nếu gộp VPC/Hybrid với Route 53/CloudFront thì **Networking là mảng sai nhiều nhất (66 câu, 21%)**. Có **3 mảng lớn** chiếm khoảng 60% số câu sai: **Networking (VPC, Hybrid, Edge/DNS)**, **Governance/IAM/Security đa tài khoản** và **Storage + Database**. Đây cũng là 3 mảng nặng nhất của SAP-C02.
- Số câu sai trải đều trên cả 4 domain của đề. Vậy vấn đề không nằm ở một domain riêng mà ở **độ sâu kiến thức tính năng** (chi tiết giới hạn của từng service) và **kỹ năng loại đáp án theo ràng buộc** (LEAST overhead, MOST cost-effective, "không được sửa ứng dụng"…).

---

## 2. Những lỗi tư duy lặp lại (quan trọng hơn việc thiếu kiến thức)

| # | Kiểu lỗi | Ví dụ bạn đã sai | Cách sửa |
|---|---|---|---|
| 1 | **Tự dựng giải pháp trong khi đã có managed service/tính năng sẵn** | Tự chạy Grafana trên ASG thay vì dùng **Amazon Managed Grafana**. SFTP trên EC2+ALB thay vì **Transfer Family**. MQTT broker/MSK+NLB thay vì **IoT Core**. Tự dựng Lambda chặn IP thay vì **Shield Advanced**. | Gặp "LEAST operational overhead" thì ưu tiên managed service hoặc tính năng native. Đáp án nào có Lambda/script/cron tự viết thường là bẫy. |
| 2 | **Over-engineering khi đề hỏi "cost-effective" hoặc "quick"** | Chọn hot-standby thay vì snapshot+restore khi RTO 30 phút. Chọn migrate cả hệ thống lên AWS trong khi chỉ cần **CloudFront trước origin on-prem** (sai 3 lần). Chọn Transit Gateway trong khi VPC peering/Client VPN là đủ. | Chọn giải pháp **nhỏ nhất vẫn thỏa đủ yêu cầu**. Có hạn gấp ("vài tuần", "2 ngày") thì không re-architect. |
| 3 | **Nhầm các tính năng có tên gần giống nhau** | Delay queue ↔ message timer. `AWS-ApplyPatchBaseline` ↔ `AWS-RunPatchBaseline`. `kms:GetDataKey` ↔ `kms:GenerateDataKey` (sai 2 lần). Redshift "cross-region replication" ↔ "cross-region snapshot copy". Tag gateway ↔ file gateway. | Học bảng phân biệt ở mục 4. |
| 4 | **Không biết giới hạn của service** | Firehose không ghi thẳng vào DynamoDB. DocumentDB không có on-demand. RDS không hỗ trợ Oracle RAC. Usage plan chỉ có ở REST API. Gateway endpoint S3 không dùng được từ on-prem. Không sửa được CIDR của subnet. Không sửa được key policy của AWS-managed KMS key. | Mỗi service cần thuộc câu "**cái gì nó KHÔNG làm được**". Đề SAP rất hay bẫy chỗ này. |
| 5 | **Đọc sót ràng buộc then chốt** | "cannot modify the application", "static IP", "must not traverse internet", "data loss unacceptable", "in order of receipt". | Gạch chân ràng buộc trước khi đọc đáp án, rồi loại đáp án vi phạm ràng buộc trước. |
| 6 | **Câu chọn nhiều đáp án: thường đúng 1, sai 1** | Rất nhiều câu Select TWO/THREE bạn chỉ sai 1 lựa chọn. | Với câu multi-select, hãy kiểm chứng **từng** lựa chọn một cách độc lập. Đừng chọn theo cảm giác "cả cụm nghe hợp lý". |

---

## 3. Chi tiết từng topic: bạn đã sai ở đâu và cần nhớ gì

Các mục đánh dấu 🔁 là **lỗi lặp lại** (sai từ 2 câu trở lên cùng một kiến thức).

### 3.1 Hybrid & VPC Networking (ưu tiên cao nhất)

**Direct Connect / VPN**
- 🔁 **Mã hóa dữ liệu qua Direct Connect**: dùng **Public VIF + Site-to-Site VPN** (IPsec chạy trên public VIF tới VGW). Bạn sai 3 câu vì chọn Private VIF. (Bây giờ còn có thêm lựa chọn MACsec cho 10/100G, và Private IP VPN qua transit VIF, nhưng đề cũ thường vẫn lấy đáp án Public VIF.)
- 🔁 **Copy dữ liệu lớn lên S3 qua DX**: dùng **Public VIF**. Private VIF + gateway endpoint không đi được từ on-prem. Nếu bắt buộc private thì dùng **S3 *interface* endpoint** qua private VIF.
- HA mà rẻ: **1 DX + 1 Site-to-Site VPN làm backup**, và VPN **static** rẻ/đơn giản hơn. "Built-in failover của DX" không tồn tại.
- Kết nối nhiều VPC ở nhiều Region: **Direct Connect Gateway**. Muốn đi tiếp qua TGW thì dùng **transit VIF → DXGW → TGW**. DXGW **không** định tuyến giữa các TGW: traffic liên Region phải dùng **TGW peering**.
- Transit VIF: quảng bá prefix on-prem vào và quảng bá prefix VPC từ DXGW ra.
- Nhiều data center: mỗi DC một DX, nên từ các nhà cung cấp khác nhau.
- VPN dual-tunnel một CGW thì **CGW là single point of failure**. Cách sửa là thêm CGW ở DC khác.

**Transit Gateway / Peering / PrivateLink**
- 🔁 Cô lập VPC trên TGW: tạo **TGW route table riêng cho từng attachment** (không sửa VPC route table). Thứ tự làm: tạo TGW → share qua RAM → tạo attachment → tạo route table → associate.
- Nối 5 VPC tới đúng 1 VPC ở Region khác thì **VPC peering rẻ hơn** TGW (TGW tính phí theo attachment và theo data).
- 🔁 Client VPN: tạo endpoint trong VPC chính (đã có peering) và cấu hình route là đủ, **không cần thêm TGW**.
- Peering: nhớ **thêm route ở CẢ HAI phía**. Peering không có tính bắc cầu (non-transitive).
- **CIDR chồng lấn** hoặc chỉ cho VPC được phép truy cập: dùng **PrivateLink endpoint service (NLB) + bật acceptance required**.
- Dùng SaaS nội bộ AWS không qua internet: **interface endpoint (PrivateLink)**, không dùng peering.
- PrivateLink xuyên Region: endpoint service có thể dùng NLB có sẵn ở Region khác (tính năng cross-region PrivateLink).
- Giảm phí data transfer của PrivateLink: **tắt cross-zone load balancing trên NLB** và dùng **DNS riêng của từng AZ**.
- Troubleshoot PrivateLink: NACL/SG giữa **subnet NLB ↔ subnet target** và SG của target phải cho phép dải subnet NLB.
- Shared services: **centralized VPC interface endpoints** trong một VPC dùng chung.
- **Gateway Load Balancer**: dùng **GWLB endpoint** (không phải interface endpoint). Target type là **instance**. Endpoint đặt ở account network trung tâm.

**Địa chỉ IP / NAT / IPv6**
- IP outbound cố định: **NAT Gateway + EIP**. BYOIP thì gán EIP từ dải BYOIP vào NAT GW (không dùng Global Accelerator, vì GA chỉ cho inbound).
- IPv6 cho private subnet: **Amazon-provided IPv6 CIDR + egress-only IGW** (không có "NAT GW IPv6").
- Proxy hoặc appliance trong suốt: **tắt source/destination check**.
- Subnet không đổi được CIDR: phải **xóa rồi tạo lại** subnet.
- Lambda nằm trong VPC cần ra internet thì phải có **NAT GW trong private subnet**. Lambda không được đặt ở public subnet.
- NAT GW tốn phí vì traffic tới Kinesis/S3: dùng **VPC endpoint** và kiểm tra **endpoint policy**.
- Soi nội dung gói tin (payload): dùng **VPC Traffic Mirroring** (sai 2 lần). Flow Logs và ALB logs không chứa payload.
- Đọc Flow Logs: traffic inbound có source là IP public và destination là dải VPC.

### 3.2 Route 53, CloudFront, Global Accelerator & Edge

- 🔁 **On-prem bị quá tải vì traffic bùng nổ và cần giải pháp nhanh**: dùng **CloudFront với custom origin là on-prem** và đặt TTL (sai 3 lần).
- 🔁 **Cache hit ratio thấp vì query string lộn xộn**: dùng **Lambda@Edge trên viewer request** để sort và lowercase (sai 2 lần). CloudFront không có tùy chọn "case-insensitive".
- HA cho origin: dùng **CloudFront origin group** (primary/secondary), không dùng Route 53 failover giữa 2 distribution.
- Trang lỗi tùy chỉnh / trang bảo trì: host trên S3 + **CloudFront custom error response**. Khi bảo trì thì **đổi default cache behavior sang S3 origin**.
- Lỗi 502 "Error from CloudFront" với custom origin: **cert SSL ở origin hết hạn hoặc thiếu chain**.
- Bảo vệ origin là ALB: **custom header + WAF/ALB rule** chỉ chấp nhận header đó. OAI/OAC chỉ áp dụng cho S3.
- Chỉ một microservice được giải mã một trường dữ liệu: **CloudFront field-level encryption** (dùng cặp khóa RSA).
- Sửa header theo User-Agent: dùng **CloudFront Functions**.
- Video on-demand mượt: **MediaConvert → HLS + manifest**, CloudFront trỏ vào manifest.
- Redirect 10 domain: **CloudFront + Lambda@Edge + ACM cert có SAN**.
- **Global Accelerator**:
  - Blue/green khi client cache DNS (điện thoại): **GA traffic dial** thay cho Route 53 weighted.
  - IP tĩnh + định tuyến tới Region gần nhất: **standard accelerator**. **Custom routing accelerator** chỉ dùng cho mapping tất định user → instance/port (game session).
- IP tĩnh trong 1 Region: **NLB + 1 EIP mỗi AZ** + alias record.
- **Route 53**:
  - Record không có health check thì **luôn được coi là healthy**. Nếu *tất cả* đều unhealthy thì Route 53 coi tất cả là healthy.
  - Alias record cần bật **Evaluate Target Health**. Weighted record cần có health check.
  - Health check HTTPS **không kiểm tra tính hợp lệ của cert**.
  - Health check cho record trong private hosted zone: dùng **CloudWatch alarm** (StatusCheckFailed) và health check theo dõi alarm đó.
  - Private hosted zone khác account: **tạo association authorization ở account A → associate VPC từ account B → xóa authorization**.
  - On-prem cần resolve tên miền custom trỏ tới EFS: **Resolver inbound endpoint + private hosted zone (CNAME)**.
- **Certificate**: ACM là **dịch vụ theo Region**, nên cần cert riêng ở mỗi Region cho ALB. Cert cho CloudFront phải nằm ở us-east-1. ALB hỗ trợ **SNI nhiều cert**. Muốn tách quyền giữa team dev và team security thì lưu cert trong ACM/IAM và gắn vào ALB.
- ALB host condition: cần cả `ecomm.com` **và** `*.ecomm.com`.

### 3.3 Multi-account Governance & IAM

- 🔁 **SCP chỉ là bộ lọc, không cấp quyền**:
  - Chiến lược allow-list thì SCP phải **allow tường minh**, nếu không sẽ bị chặn dù IAM có cho phép.
  - SCP cho phép `*` nhưng user vẫn không làm được gì thì **IAM chưa cấp quyền**.
  - SCP **ảnh hưởng tới cả root user của member account** nhưng **không** ảnh hưởng tới management account và service-linked role.
  - Deny-list thì **giữ lại FullAWSAccess**.
- Onboarding account mới bị SCP ở root chặn: chuyển SCP từ **root xuống OU Production** và đặt account mới vào OU Onboarding.
- 🔁 **Cross-account AssumeRole cần đủ 3 thứ**: **SCP account A cho phép**, **identity policy của user ở A**, **trust policy của role ở B**.
  - Tạo lại role cùng tên thì trust policy phía kia bị hỏng (principal ID đổi), phải **sửa lại ARN**.
  - Bên thứ ba (confused deputy): dùng **External ID**.
  - Cross-account S3 + KMS: key policy nên chỉ định **principal là ARN của role** (least privilege), không phải account ID.
  - Secrets Manager mã hóa bằng **AWS-managed key thì không share cross-account được**. Cách làm là tạo role trong account ứng dụng để account DBA assume.
- 🔁 **OrganizationAccountAccessRole**:
  - Được tạo tự động cho account **tạo từ Organizations**. Account **được mời vào** thì phải **tự tạo role này trong member account**.
  - Truy cập member account mới: **switch role** từ management account.
  - Cho security team quyền read-only: dùng OrganizationAccountAccessRole để tạo role read-only trong từng account, trust account security.
- Chuyển account sang org khác: **Remove → Invite → member Accept**.
- **Reserved Instance**:
  - RI được chia sẻ trong consolidated billing nhưng **RI theo AZ chỉ áp dụng cho đúng AZ đó**.
  - Muốn không chia sẻ: **tắt RI sharing** trong Billing của management account (SCP không làm được việc này).
- 🔁 **Bắt buộc gắn tag**:
  - **Chặn tạo resource thiếu tag**: SCP với `Condition: Null aws:RequestTag/X = true`.
  - **Tag policy** chỉ chuẩn hóa giá trị, không chặn việc tạo, và phải **gắn vào OU** (không gắn vào management account).
  - Tìm resource thiếu tag trên toàn org: **Config rule + Config aggregator**.
- **Control Tower**:
  - Phát hiện RDS không mã hóa: bật **guardrail strongly recommended** (loại detective).
  - Chặn EC2 có public IP cho cả instance **mới lẫn cũ**: dùng **SCP**. Proactive control chỉ kiểm tra CloudFormation.
  - Cần baseline nhanh + linh hoạt compliance: **Control Tower** thay vì tự dựng Organizations + Config.
- Security Hub: bật cho org và **chỉ định delegated administrator**. Không dùng Config conformance pack cho mục đích xem tổng quan.
- 🔁 **Service Catalog** (sai ≥4 câu):
  - Muốn user chỉ launch resource được duyệt, least privilege, bắt tag, dùng chung nhiều account: **Service Catalog portfolio + launch constraint (role) + TagOptions**, và user chỉ có quyền Service Catalog.
  - Phương án thay thế: IAM chỉ cho CloudFormation + **CloudFormation service role**.
- **Identity**:
  - AD on-prem + IAM Identity Center rẻ nhất: **AD Connector** (không cần Managed AD + trust).
  - Azure AD: dùng làm **external IdP** cho IAM Identity Center, đồng bộ user/group tự động (SCIM).
  - Multi-account + MFA + phân quyền theo nhóm: **IAM Identity Center + permission sets**.
  - SAML chỉ chạy được với tài khoản admin: kiểm tra **IdP assertion mapping**, **trust policy của role trỏ tới SAML provider**, **AssumeRoleWithSAML**. SAML không đi qua IAM user.
  - ABAC với session tag: đặt **Deny + StringNotEquals** trong policy của role (không dùng SCP allow).
  - Xác thực trên ALB bằng directory hoặc MFA mà không sửa app: **Cognito user pool + `authenticate-cognito`**.
  - MFA cho WorkSpaces: phải có **RADIUS**.
  - RDP qua AD tập trung, rẻ: **IAM Identity Center + Fleet Manager**.
- EC2 truy cập S3: cần **trust policy** (EC2 được assume role) **+ permissions policy**.

### 3.4 Security, Encryption & Compliance

- 🔁 **Client-side encryption với KMS**: bắt buộc có **`kms:GenerateDataKey`** (sai 2 lần).
- KMS dùng key material từ HSM riêng: tạo key với **origin EXTERNAL** rồi import key material.
- 🔁 **Redshift DR cross-region khi cluster mã hóa KMS**: tạo **snapshot copy grant ở Region đích** + bật **cross-region snapshot copy** (sai 3 câu).
- S3 SSE-C: cần 3 header `x-amz-server-side-encryption-customer-*`. Với presigned URL thì chỉ định **algorithm header**.
- Đổi từ SSE-S3 sang key do team quản lý: **SSE-KMS (CMK)** + bucket policy chặn upload không mã hóa + re-upload object.
- S3 event gửi vào SQS có SSE: phải dùng **customer-managed KMS key**, vì key policy của AWS-managed key không sửa được.
- **WAF**:
  - Triển khai không làm hỏng traffic thật: bật **Count mode → phân tích log → chuyển sang Block**.
  - Chặn theo quốc gia + log request bị chặn: **WAF geo match**. Shield không lọc theo quốc gia.
  - Log sang bên thứ ba: **WAF logging → Kinesis Firehose**. Dùng thêm AWS Managed Rules.
  - WAF **không gắn được trực tiếp vào EC2**. Chỉ gắn được vào ALB, CloudFront, API Gateway, AppSync, Cognito…
- DDoS tầng 7 từ nhiều IP: **Shield Advanced**.
- **Firewall Manager** cần 3 điều kiện: **Organizations bật all features + AWS Config ở mọi account + admin account**. Cách khác để quản lý WAF toàn org: org Config rule + SSM remediation + StackSets.
- **Inspector**: quét lỗ hổng EC2/ECR/Lambda, code scanning cho Lambda (loại trừ bằng tag), và phân tích **network reachability** (port mở). Để quét lỗ hổng thì chọn Inspector, không chọn Security Hub hay Flow Logs.
- **CloudTrail**:
  - Bảo vệ log: **log file integrity validation + MFA Delete**.
  - Giám sát: trail → CloudWatch Logs + mã hóa KMS.
  - 🔁 Phản ứng với API call cụ thể (CreateUser…): **EventBridge rule với "AWS API Call via CloudTrail"** → Step Functions/SNS. CloudTrail không tự gửi SNS theo từng event (sai 2 lần).
- Cảnh báo khi bucket bị public: **IAM Access Analyzer + EventBridge (isPublic: true)**. Với object public: CloudTrail data events + EventBridge → SNS → Lambda để khắc phục.
- Compliance liên tục: **Config rules (periodic + change-triggered) + CloudTrail** ở tất cả account.
- EBS chưa mã hóa: dùng **Config managed rule + SSM Automation remediation + bật EBS encryption by default**. Muốn mã hóa volume cũ thì snapshot → copy có mã hóa → tạo volume mới.
- SSH key riêng cho từng instance + log vào CloudTrail: **EC2 Instance Connect** (`SendSSHPublicKey`).
- Chống ransomware cho backup: **AWS Backup cross-account vault + Vault Lock compliance mode + SCP chặn sửa vault**.
- Glacier compliance: **Vault Lock policy** (không dùng ACL).

### 3.5 Storage (S3, EFS, FSx, Storage Gateway, EBS)

- **Storage class**:
  - Bucket đích của CRR, sau đó lifecycle chuyển ngay sang Glacier: để **Standard**. Standard-IA có thời gian lưu tối thiểu 30 ngày nên tốn thêm tiền.
  - Bản sao dữ liệu đã có nơi khác, ít truy cập, cần hosting: **One Zone-IA**. Deep Archive không phục vụ web được.
  - FSx for Lustre lazy-load từ S3: dùng **Intelligent-Tiering**. Glacier IR không phải lựa chọn tối ưu ở đây.
  - Data lake: zone raw → Deep Archive, zone curated → **định dạng nén/columnar**.
  - Dữ liệu cần giữ để compliance: lifecycle sang **Deep Archive** (không xóa).
- **Upload nhanh**:
  - **S3 Transfer Acceleration** (+ multipart, + presigned URL dùng endpoint accelerate). TA không tính phí nếu không tăng tốc được.
  - CloudFront cũng tăng tốc được upload.
  - Nhiều Region cùng đổ dữ liệu về một bucket trung tâm: **bucket local ở từng Region + CRR** nhanh hơn TA.
- 🔁 **Đồng bộ 2 Region active-active**: **Multi-Region Access Point + CRR hai chiều + bật Versioning** (CRR bắt buộc có versioning).
- 🔁 **S3 Access Points**: tạo trong **account sở hữu bucket**, mỗi access point giới hạn theo VPC. Tạo **gateway endpoint ở từng VPC của ứng dụng** với endpoint policy cho phép access point. Bucket policy chỉ cho truy cập qua access point.
- Static website bị Access Denied: **object phải thuộc account sở hữu bucket** và **object không được mã hóa bằng KMS**.
- S3 RTC cảnh báo khi quá 15 phút: dùng **S3 event notification** (`OperationMissedThreshold`).
- Chỉ đọc một phần object: **S3 Select ScanRange / Byte-Range Fetch**. Query một file gzip CSV: **S3 Select** rẻ hơn Athena.
- Phân tích xu hướng dung lượng/mã hóa: **S3 Storage Lens**. Dashboard mặc định đã bao phủ mọi Region. Advanced metrics cho xu hướng 12 tháng.
- Presigned URL hết hiệu lực khi **credential của người tạo hết hạn hoặc cấu hình sai**. Versioning không làm URL mất hiệu lực.
- Lưu hàng triệu bản ghi nhỏ (dưới 4KB) cần truy xuất nhanh và TTL 120 ngày: **DynamoDB + TTL**, không dùng S3.
- **EFS**:
  - **Mount được từ on-prem** qua DX/VPN, dùng thay NAS.
  - Có **EFS replication** sang Region khác (RPO khoảng phút).
  - Dùng provisioned throughput khi cần.
- **FSx for Windows**:
  - HA: tạo **Multi-AZ** mới + DataSync. Test failover bằng cách **đổi throughput capacity**.
  - Giám sát: **CloudWatch** + **file access auditing → CloudWatch Logs/Firehose**.
  - Đầy dung lượng: `update-file-system` + CloudWatch + EventBridge + Lambda tự động tăng.
- 🔁 **Storage Gateway**:
  - App cần SMB/NFS mà dữ liệu nằm trên S3: **File Gateway**.
  - Video cho Rekognition: File Gateway, **không dùng Tape Gateway** (sai 2 lần).
  - Gateway-stored volume khi DR: **tạo EBS snapshot → restore thành EBS volume**.
- **EBS snapshot** copy sang nhiều Region: **Data Lifecycle Manager**. S3 CRR không áp dụng cho snapshot.
- Oracle RAC không chạy trên RDS: **EC2 + EBS + DLM**.
- **DataSync**: agent chạy trên hypervisor, có filter, lịch chạy. Tới EFS thì đi **private VIF + interface endpoint**.

### 3.6 Databases

- 🔁 **Multi-AZ và Read Replica**:
  - Multi-AZ replication **đồng bộ (sync)**. Read replica **bất đồng bộ (async)**.
  - Read replica của RDS promote thành **standalone**. Aurora replica promote thành **primary**.
  - Khi upgrade engine, primary và standby **được upgrade cùng lúc**.
- Workload đọc nhiều: **Read Replica + ElastiCache**. Khi đề hỏi "cost-effective", không chọn sharding hay CloudFront cho dữ liệu động.
- Workload ghi nhiều và tăng liên tục (IoT): **Kinesis + Lambda + DynamoDB**, không dùng Aurora + read replica.
- 🔁 **Failover dưới 20 giây và giữ connection**: **Aurora + RDS Proxy + Aurora Replica**.
- **Lambda gọi DB**:
  - Dùng RDS Proxy.
  - **Mở connection bên ngoài handler**.
  - Để giảm latency dùng **provisioned concurrency**. Reserved concurrency chỉ giới hạn/đặt trước số concurrency, không giảm cold start.
- Cache session: **ElastiCache Redis có replication**. Session + DR đa Region hiệu năng cao: **DynamoDB global table**.
- Reliability tối đa cho MySQL: **Aurora MySQL** (thay vì RDS Multi-AZ).
- **DynamoDB**:
  - Tải dự đoán được: **provisioned + auto scaling (+ reserved capacity)** rẻ hơn on-demand.
  - Dữ liệu theo ngày: **tạo bảng mới mỗi ngày, xóa bảng cũ**.
  - DAX chỉ giúp đọc, không giúp ghi.
  - Tính chi phí theo tenant: log số RCU/WCU tiêu thụ của từng tenant.
- **Redshift**:
  - DR: **automatic snapshot + cross-region snapshot copy**. Redshift không có "CRR".
  - Dữ liệu lạnh: xả ra S3 rồi query bằng **Athena/Spectrum**.
- **DocumentDB** không có on-demand capacity: phải chọn instance size.
- **Aurora chuyển sang account khác**: **RAM share + clone**, hoặc **snapshot share + DMS (CDC)**.
- SQL Server near-zero downtime: dùng **native replication** sang RDS.
- **DMS**:
  - Kiểm tra dữ liệu: **DMS data validation** (không phải SCT).
  - Schema và stored procedure: **SCT**.
  - Target Redshift: **cùng account và cùng Region** với replication instance.
  - Replicate liên tục vào Redshift: dùng DMS, không dùng EMR.
  - DB 60TB, băng thông yếu: **Snowball Edge → S3 → DMS**.
- QuickSight → RDS private: **QuickSight VPC connection**.

### 3.7 Analytics, Streaming & IoT

- 🔁 **Kinesis Data Streams và Firehose**:
  - **KDS**: real-time, có thứ tự, consumer tùy ý (Lambda/KCL).
  - **Firehose**: *near* real-time, chỉ dùng để **deliver** tới S3/Redshift/OpenSearch/Splunk/HTTP. **Không** ghi được vào DynamoDB và không làm nguồn cho Step Functions.
  - Kinesis Data Analytics nhận input từ **KDS/Firehose**. Lambda không đẩy thẳng vào KDA được.
- `ReadProvisionedThroughputExceeded`: **reshard + enhanced fan-out + retry với exponential backoff**. KPL là thư viện phía producer.
- KCL: **mỗi ứng dụng một bảng DynamoDB riêng** để lưu checkpoint.
- 🔁 JSON bán cấu trúc, schema động, dashboard gần real-time: **Firehose → Lambda transform → OpenSearch + Dashboards (Kibana)**. Neptune là graph DB, không dùng ở đây (sai 2 lần).
- 🔁 **IoT / MQTT**: dùng **AWS IoT Core** (custom domain, IoT rule → Firehose/DynamoDB). Greengrass dùng cho edge. MSK sau NLB không phải cách nhận MQTT.
- IoT → SQL đơn giản, rẻ: **Firehose → Parquet trên S3 → Athena**, không dùng Aurora.
- **Định dạng dữ liệu**: Parquet/ORC có nén, **partition theo cột lọc thường dùng** (ví dụ theo ngày khi query hằng ngày).
- Query SQL chỉ vài giờ mỗi ngày: **S3 + Glue Data Catalog + Athena** thay cho EMR thường trực hoặc Redshift.
- EMR tiết kiệm: **task node dùng Spot**, **terminate cả cluster** khi xong (transient cluster).
- OpenSearch: **UltraWarm**, còn dữ liệu gốc lưu **Deep Archive** để đáp ứng compliance.
- Bán dữ liệu Redshift: **Data Exchange datashare + subscription verification**.
- Redshift cold data: Athena.

### 3.8 Serverless, Containers & Application Integration

- **SQS**:
  - 🔁 Delay cho **từng message**: dùng **message timer**. Delay queue áp dụng cho cả queue.
  - Cần thứ tự và serverless: **SQS FIFO** thay cho RabbitMQ/Amazon MQ.
  - Không được mất dữ liệu khi API bị burst: **API Gateway service integration → SQS → Lambda**.
  - Message rơi vào DLQ trong khi app không lỗi: bật **scale-in protection** cho instance đang xử lý. Termination protection không liên quan tới ASG scale-in.
- **Throttling**:
  - SNS → Lambda bị mất message: nguyên nhân là **giới hạn concurrency của Lambda**, không phải SNS.
  - API Gateway trả 429 và Lambda không được gọi: chạm **giới hạn throttle cấp account**.
  - **Usage plan + API key chỉ có trên REST API** (HTTP API không có).
- **API Gateway**:
  - REST là stateless, WebSocket là stateful.
  - Nhiều GET lặp lại: **bật caching ở stage** (+ edge-optimized).
  - Tích hợp thẳng DynamoDB: **REST API AWS integration**.
  - Webhook: **HTTP API + Lambda**.
  - IdP OAuth bên thứ ba: **Lambda authorizer** (hoặc JWT authorizer).
- **Step Functions**: muốn xử lý song song từng item thì dùng **một workflow gọi workflow con cho từng ảnh**. Đừng đưa SQS vào làm input.
- **Event**: xử lý ảnh vừa upload với latency thấp nhất: **S3 event notification → Lambda**. Muốn chạy lại được khi lỗi: S3 → **SQS** → Lambda.
- **Lambda**:
  - Dùng layer cho code tái sử dụng.
  - Đặt **CloudWatch alarm cho ConcurrentExecutions**.
  - Canary: **alias + routing-config**.
- **ECS/EKS**:
  - Scale số task: **Service Auto Scaling**. Cluster Autoscaler là của K8s node.
  - Batch ngắn chạy mỗi 4 giờ: **Fargate + EventBridge schedule**.
  - Nhiều app nhỏ ít traffic: **container hóa lên ECS**.
  - EKS resilience: **topology spread constraints theo AZ**.
- Quan sát ứng dụng: **X-Ray** (lỗi 504, trace SQL) + CloudWatch Logs agent + slow query log của Aurora.
- **Transfer Family**:
  - Ghi thẳng **vào S3** + event → Lambda.
  - Cần IP tĩnh: **VPC endpoint internet-facing + EIP**.
- **SES từ app chỉ biết SMTP**: dùng **SMTP credentials + STARTTLS**.
- **Amazon Connect**:
  - Nhận diện intent của người gọi: **Lex**.
  - DR: dựng sẵn users và flows, chỉ claim số điện thoại khi failover.
  - Đánh dấu spam: custom CCP + `UpdateContactAttributes`.
- App Windows cho người dùng Linux: **AppStream 2.0**.
- Quản lý document có version và rollback: **WorkDocs** (đáp án của đề cũ).

### 3.9 Migration & Transfer

- **Chiến lược 7R**: dùng OpsWorks (Chef) là **Replatform** (không phải Rehost). App PoC ít traffic: **container hóa + ECS**.
- 🔁 **Discovery và đánh giá**:
  - **Application Discovery Agent + Migration Hub**: nhóm server, gợi ý instance type và chi phí, **network graph**, **data exploration bằng Athena** để tìm dependency theo port.
  - **Migration Evaluator**: business case/TCO từ file CMDB, agentless collector qua SNMP. Báo cáo **do chính Migration Evaluator tạo** (Quick Insights).
  - Đã có Discovery Agent thì không cần thêm Migration Evaluator Collector.
- **Rehost VM**:
  - **MGN**: replication agent, hoặc **agentless appliance trên vCenter** khi không được cài phần mềm lên VM.
  - VM Import: export **OVF** → S3 → `import-image`.
  - Đề cũ có dùng SMS cho downtime thấp. Ngày nay AWS khuyên dùng MGN.
- DR cho server on-prem: **AWS Elastic Disaster Recovery**. Replication dùng private IP qua DX, có throttle băng thông.
- **Chọn cách chuyển dữ liệu**:
  - 9PB: **nhiều Snowball Edge** (Snowmobile chỉ hợp lý khi từ ~10PB trở lên).
  - 1TB, sửa đổi hằng ngày: **`s3 sync` trước rồi sync lần cuối**.
  - Backup hằng ngày có filter: **DataSync**.
  - 140TB qua DX 10G: **Public VIF**.
- Hệ IBM: **Db2 → Aurora (SCT+DMS)**, **MQ → Amazon MQ**, WebSphere → EC2 + ASG.
- License gắn với MAC address: dùng **pool ENI**. IP DB cứng: lưu trong **SSM Parameter Store** và bootstrap từ đó.
- 🔁 Chia sẻ file NAS trong lúc migrate: **EFS mount từ on-prem** (NFS) hoặc **File Gateway** (SMB → S3).

### 3.10 IaC, Deployment & Operations

- **CloudFormation**:
  - Deploy AMI mới không downtime: **UpdatePolicy `AutoScalingRollingUpdate`**.
  - 🔁 Chống xóa mất dữ liệu: **DeletionPolicy (Retain/Snapshot)**. Stack policy chỉ bảo vệ khi *update*.
  - 🔁 Xóa stack lỗi vì S3 bucket còn object: **custom resource Lambda xóa object + `DependsOn`** (sai 2 lần).
  - AMI mới nhất: **SSM Parameter Store public parameter**.
  - Test template: CodePipeline dùng **CloudFormation action (change set)**. CodeDeploy không liên quan.
  - Multi-account/multi-Region: **StackSets**.
  - Cấp CIDR không trùng: **custom resource gọi IPAM** (nay có thể dùng VPC IPAM).
  - Dev quen Python/TypeScript: **CDK** + CodeBuild trong pipeline.
- **CodePipeline cross-account**:
  - Account A: tạo **CMK + artifact bucket**, cấp quyền cho B.
  - Account B: tạo **cross-account role** + **CloudFormation service role**.
- **Deploy và rollback**:
  - Nhanh nhất: **Elastic Beanstalk swap URL** (blue/green).
  - Beanstalk có RDS gắn kèm: **tách RDS ra khỏi environment** trước.
  - Lambda: alias traffic shifting.
- **ASG**:
  - Request bị timeout khi scale-in: **connection draining (deregistration delay)**.
  - Patch bị mất khi instance bị thay: **patch AMI → cập nhật launch template → instance refresh**.
  - Health check nên trỏ vào **trang đơn giản**, dùng Route 53 health check cho check sâu, tránh ASG thay instance liên tục khi DB chậm.
- **Systems Manager**:
  - Dùng **`AWS-RunPatchBaseline`** + maintenance window.
  - Báo cáo patch compliance cho cả hybrid.
  - Instance không hiện trong SSM: kiểm tra **agent + IAM instance profile**.
- CloudWatch: đếm unique user từ log thì dùng **metric filter có dimension** (không cần sửa agent).

### 3.11 Cost Optimization & Billing

- Cost allocation tags: **kích hoạt ở management account**. Kết hợp **Cost Categories + Cost Explorer** (có forecast 12 tháng) và CUR.
- Phát hiện chi phí bất thường: **Cost Anomaly Detection**, thay cho billing alarm đặt ngưỡng cố định.
- Chọn mô hình mua:
  - Chạy 24/7 cả năm: **Savings Plans/RI**.
  - Workload chịu được gián đoạn: **Spot**.
  - Baseline thấp nhưng có peak: **ASG, min = RI, max để phục vụ peak**.
  - Chủ yếu nhàn rỗi: **burstable (T)** + frontend tĩnh trên S3.
- Rightsizing: **Compute Optimizer + CloudWatch agent** (cần metric memory). **Trusted Advisor low utilization** + EventBridge để tự dừng instance (cần gói Business support).
- Chi phí NAT/data transfer tới S3: dùng **gateway endpoint** (miễn phí), ép dùng qua **Service Catalog**.
- Xu hướng chi phí S3: **Storage Lens**.
- Phân bổ chi phí DynamoDB cho từng tenant: **log RCU/WCU theo tenant**, rồi tính trên số liệu từ Cost Explorer API.

### 3.12 DR, HA & Backup (topic chéo)

- **RTO/RPO và chi phí**: Backup & Restore < Pilot Light < Warm Standby < Active/Active. Chọn **mức rẻ nhất vẫn đạt RTO/RPO**.
  - Ví dụ: RTO 30 phút, RPO 5 phút thì dùng **snapshot/AMI cho tầng stateless + Aurora cross-region replica**.
- **Công cụ replicate theo service**:
  - Aurora: cross-region replica / Global Database.
  - DynamoDB: global tables.
  - S3: CRR/MRAP.
  - EFS: replication.
  - Redshift: snapshot copy.
  - EBS: DLM copy.
  - RDS: **AWS Backup** (cross-account management + backup plan theo tag + monitor tập trung).
- Active-active đa Region: **DynamoDB global table + Fargate/ALB ở mỗi Region + Route 53 latency + health check**.
- Server on-prem: **Elastic Disaster Recovery**. Amazon Connect: instance ở Region thứ hai.

---

## 4. Bảng phân biệt các khái niệm hay nhầm

| Bạn đã chọn (sai) | Đáp án đúng | Ghi nhớ |
|---|---|---|
| Private VIF + VPN | **Public VIF + VPN** | IPsec qua DX đi trên public VIF |
| S3 gateway endpoint từ on-prem | **S3 interface endpoint** | Gateway endpoint chỉ dùng được bên trong VPC |
| Delay queue | **Message timer** | Timer áp dụng cho từng message |
| `AWS-ApplyPatchBaseline` | **`AWS-RunPatchBaseline`** | Apply là document cũ, chỉ cho Windows |
| `kms:GetDataKey` / `GetKeyPolicy` | **`kms:GenerateDataKey`** | Envelope encryption |
| Redshift cross-region replication | **Cross-region snapshot copy + snapshot copy grant** | Redshift không có CRR |
| Stack policy | **DeletionPolicy** | Stack policy chỉ áp dụng khi update |
| Tape gateway | **File gateway** | Rekognition đọc được từ S3 |
| Neptune | **OpenSearch** | Dashboard cho JSON |
| Greengrass / MSK+NLB | **IoT Core** | MQTT được quản lý hoàn toàn |
| Custom routing accelerator | **Standard accelerator** | Custom routing chỉ để map tất định |
| Route 53 weighted (blue/green trên mobile) | **Global Accelerator** | Tránh bị ảnh hưởng bởi DNS cache |
| Interface endpoint cho GWLB | **GWLB endpoint** | Là loại endpoint riêng |
| NAT GW IPv6 | **Egress-only IGW** | IPv6 outbound-only |
| Security Hub để quét lỗ hổng | **Amazon Inspector** | Security Hub chỉ tổng hợp findings |
| VPC Flow Logs / ALB logs | **Traffic Mirroring** | Cần payload |
| Tag policy ở management account | **Tag policy gắn vào OU** + SCP Null condition | Tag policy không chặn việc tạo resource |
| Proactive control (Control Tower) | **SCP** | Proactive control chỉ kiểm tra CloudFormation |
| Termination protection | **Scale-in protection** | ASG bỏ qua termination protection |
| Lifecycle hook | **Connection draining** | Vấn đề nằm ở lúc scale-in |
| Reserved concurrency | **Provisioned concurrency** | Provisioned giảm latency/cold start |
| Cluster Autoscaler (ECS) | **ECS Service Auto Scaling** | |
| Usage plan trên HTTP API | **REST API** | |
| DocumentDB on-demand | **Instance-based** | |
| Snowmobile cho 9PB | **Nhiều Snowball Edge** | |
| Migration Hub tạo báo cáo TCO | **Migration Evaluator** | |
| Rehost bằng OpsWorks | **Replatform** | |
| RDS Multi-AZ async | **Sync** | Read replica mới là async |
| AWS-managed KMS key cho SQS/Secrets cross-account | **Customer-managed key** / assume role | Key policy của AWS-managed key không sửa được |
| Tắt RI sharing bằng SCP | **Billing preferences ở management account** | |
| Đưa hot-standby vào khi đề hỏi cost | **Snapshot/AMI + replica cho DB** | |

---

## 5. Lộ trình ôn tập (5 tuần, khoảng 2–3 giờ/ngày)

> Nếu còn ít thời gian hơn thì gộp tuần 1+2 và tuần 3+4, giữ nguyên tuần 5.
> Mỗi ngày đều theo vòng lặp: **Học lý thuyết (45') → Vẽ sơ đồ/tóm tắt 1 trang (15') → Làm lại câu sai của topic đó trong Phụ lục mà không nhìn đáp án (45') → Ghi error log (15')**.

### Tuần 1: Networking (VPC + Hybrid + Edge/DNS gộp lại là mảng sai nhiều nhất: 66 câu chính, 21%)
| Ngày | Nội dung | Tài liệu gợi ý |
|---|---|---|
| 1 | Direct Connect: các loại VIF (private/public/transit), DXGW, HA models, VPN over DX, MACsec | DX User Guide: "Virtual interfaces", "Resiliency Toolkit"; whitepaper *Hybrid Connectivity* |
| 2 | Transit Gateway: route tables, association/propagation, RAM sharing, TGW peering, centralized egress/inspection | Whitepaper *Building a Scalable and Secure Multi-VPC AWS Network Infrastructure* |
| 3 | PrivateLink / VPC endpoints (gateway, interface, GWLB), endpoint policies, cross-region PrivateLink, NLB | VPC PrivateLink docs, GWLB docs |
| 4 | NAT/IGW/egress-only IGW/IPv6, BYOIP, source/dest check, Traffic Mirroring, Flow Logs, Client VPN | VPC User Guide |
| 5 | Route 53: routing policies, health check semantics, private hosted zone cross-account, Resolver endpoints | Route 53 Developer Guide: "How health checks work", "Resolver" |
| 6 | CloudFront (origin groups, Lambda@Edge vs CloudFront Functions, field-level encryption, error pages, OAC, custom header) + Global Accelerator + ACM | CloudFront Developer Guide; GA docs |
| 7 | **Làm lại toàn bộ câu sai của 3.1 + 3.2** và 1 bài 20 câu networking | |

### Tuần 2: Governance, IAM & Security đa tài khoản
| Ngày | Nội dung | Tài liệu |
|---|---|---|
| 1 | Organizations: SCP (allow-list vs deny-list, logic đánh giá), OU design, OrganizationAccountAccessRole, di chuyển account, RI/SP sharing | Whitepaper *Organizing Your AWS Environment Using Multiple Accounts* |
| 2 | IAM policy evaluation logic (SCP ∩ identity ∩ resource ∩ boundary ∩ session), cross-account roles, External ID, ABAC/session tags | IAM docs: "Policy evaluation logic" |
| 3 | Control Tower (guardrail loại preventive/detective/proactive), IAM Identity Center (AD Connector vs Managed AD, external IdP), SAML, Cognito + ALB | Control Tower docs |
| 4 | Service Catalog (portfolio, launch/template constraint, TagOptions, share org), CloudFormation service role, tag policies | Service Catalog Admin Guide |
| 5 | KMS (key policy, grants, imported key material, multi-Region keys, envelope encryption), S3 encryption SSE-S3/KMS/C | KMS Developer Guide |
| 6 | WAF, Shield Advanced, Firewall Manager, Inspector, GuardDuty, Security Hub, Access Analyzer, Config + remediation, CloudTrail + EventBridge | Security Pillar của Well-Architected |
| 7 | **Làm lại câu sai 3.3 + 3.4** + 20 câu mix | |

### Tuần 3: Storage, Database, DR
| Ngày | Nội dung | Tài liệu |
|---|---|---|
| 1 | S3 nâng cao: storage class + phí tối thiểu, lifecycle, CRR/SRR/RTC/MRAP, access points, TA, Select, Storage Lens, Object Lock | S3 User Guide + S3 FAQ |
| 2 | EFS, FSx (Windows/Lustre/ONTAP/OpenZFS), Storage Gateway (File/Volume/Tape), EBS + DLM, DataSync | Các FAQ tương ứng |
| 3 | RDS/Aurora: Multi-AZ, replica, Global Database, RDS Proxy, cross-account share/clone, Backtrack | Aurora User Guide |
| 4 | DynamoDB (capacity modes, auto scaling, reserved, TTL, streams, global tables, DAX), ElastiCache Redis vs Memcached, DocumentDB, Redshift (snapshot copy, Spectrum, datashare) | |
| 5 | DR strategies + RTO/RPO, AWS Backup (cross-account/region, Vault Lock), Elastic Disaster Recovery | Whitepaper *Disaster Recovery of Workloads on AWS* |
| 6 | Xem lại error log tuần 1–2 (spaced repetition) + 20 câu mix | |
| 7 | **Làm lại câu sai 3.5 + 3.6 + 3.12** | |

### Tuần 4: Serverless/Integration, Analytics, Migration, IaC, Cost
| Ngày | Nội dung | Tài liệu |
|---|---|---|
| 1 | SQS/SNS/EventBridge/Step Functions, API Gateway (REST vs HTTP vs WebSocket, throttling, usage plans, caching, authorizers), Lambda concurrency | |
| 2 | ECS/Fargate/EKS scaling, Beanstalk deployments, ASG (lifecycle hooks, instance refresh, draining, scale-in protection), X-Ray | |
| 3 | Kinesis (KDS/Firehose/KDA, fan-out, resharding), Glue/Athena/EMR, OpenSearch, IoT Core, định dạng Parquet/ORC | |
| 4 | Migration: 7R, Discovery/Migration Hub/Migration Evaluator, MGN, DMS/SCT, họ Snow, DataSync, Transfer Family | Whitepaper *AWS Migration Whitepaper* / *7 Rs* |
| 5 | CloudFormation (UpdatePolicy, DeletionPolicy, custom resource, StackSets, change set), CDK, CodePipeline cross-account, SSM (Patch Manager, Automation, Parameter Store) | |
| 6 | Cost: CUR, cost allocation tags, Cost Categories, Anomaly Detection, Compute Optimizer, Trusted Advisor, RI/SP/Spot | Cost Optimization Pillar |
| 7 | **Làm lại câu sai 3.7 → 3.11** | |

### Tuần 5: Luyện đề và củng cố
| Ngày | Nội dung |
|---|---|
| 1 | Full mock exam 75 câu / 180 phút, theo đúng điều kiện thi thật |
| 2 | Review **toàn bộ** câu sai, kể cả câu đúng mà còn phân vân. Cập nhật error log |
| 3 | Học lại 2 topic có tỉ lệ sai cao nhất trong mock |
| 4 | Full mock exam thứ 2 |
| 5 | Review + đọc lại bảng mục 4 và các ý 🔁 ở mục 3 |
| 6 | Làm lại **toàn bộ câu 🔁 và 10 câu sai 2 lần** ở phụ lục |
| 7 | Nghỉ nhẹ, lướt lại cheat sheet. Không học kiến thức mới |

**Mục tiêu:** mỗi mock đạt **từ 80% trở lên** (điểm đậu SAP là 750/1000, tương đương khoảng 72%, nhưng nên có biên an toàn).

### Phương pháp ôn để không sai lại
1. **Error log** với 4 cột: *Câu/ID → Tôi chọn gì và vì sao → Vì sao sai → Quy tắc rút ra (1 dòng)*.
2. **Spaced repetition**: làm lại câu sai sau **1, 3, 7, 14 ngày**. Làm đúng 2 lần liên tiếp thì mới loại khỏi danh sách.
3. **Kỹ thuật đọc câu SAP**:
   1. Đọc câu hỏi (dòng cuối) trước.
   2. Gạch chân các ràng buộc (cost / overhead / downtime / không sửa app / thời hạn).
   3. Loại 2 đáp án vi phạm ràng buộc.
   4. So sánh 2 đáp án còn lại **ở điểm khác biệt duy nhất** giữa chúng.
4. Với những câu mà đáp án đúng và sai **chỉ khác nhau 1 cụm từ** (rất nhiều câu của bạn thuộc dạng này), cụm từ khác biệt đó chính là kiến thức cần học.

---

## 6. Phụ lục: danh sách câu sai theo topic

Ký hiệu: ⚠️ = sai ở cả 2 lần làm · ✅ = lần làm gần nhất đã đúng. Không có ký hiệu nghĩa là mới làm 1 lần và sai.
Mỗi dòng gồm: `[Đề] Q# | Tóm tắt đề → Đáp án đúng`


<details>
<summary><b>3.1 Hybrid & VPC Networking</b>: 40 câu</summary>

- **[Internet - 1] Q22**: A company is building a serverless application that runs on an AWS Lambda function that is attached to a VPC. The company needs to integrate the application with a new…<br>→ **Đúng:** Deploy a NAT gateway. Associate an Elastic IP address with the NAT gateway. Configure the VPC to use the NAT gateway.
- **[Internet - 1] Q31**: An AWS customer has a web application that runs on premises. The web application fetches data from a third-party API that is behind a firewall. The third party accepts…<br>→ **Đúng:** Register a block of customer-owned public IP addresses in the AWS account. Create Elastic IP addresses from the address block and assign them to the NAT gateways in the VPC.
- **[Internet - 1] Q62**: A company wants to use a third-party software-as-a-service (SaaS) application. The third-party SaaS application is consumed through several API calls. The third-party…<br>→ **Đúng:** Create an AWS PrivateLink interface VPC endpoint. Connect this endpoint to the endpoint service that the third-party SaaS application provides. Create a security group to limit the access to the endpoint. Associate the security group with the endpoint.
- **[Internet - 1] Q67**: A company with global offices has a single 1 Gbps AWS Direct Connect connection to a single AWS Region. The company’s on-premises network uses the connection to…<br>→ **Đúng:** Provision a Direct Connect gateway. Delete the existing private virtual interface from the existing connection. Create the second Direct Connect connection. Create a new private virtual interface on each connection, and connect both private virtual interfaces…
- **[Internet - 2] Q15**: A team collects and routes behavioral data for an entire company. The company runs a Multi-AZ VPC environment with public subnets, private subnets, and in internet…<br>→ **Đúng:** Add an interface VPC endpoint for Kinesis Data Streams to the VPC. Ensure that the VPC endpoint policy allows traffic from the applications.
- **[Internet - 2] Q16**: A retail company has an on-premises data center in Europe. The company also has a multi-Region AWS presence that includes the eu-west-1 and us-east-1 Regions. The…<br>→ **Đúng:** Create a transit VIF from the DX-A connection into a Direct Connect gateway. Create a transit VIF from the DX-B connection into the same Direct Connect gateway for high availability. Associate both the eu-west-1 and us-east-1 transit gateways with this Direct…
- **[Internet - 2] Q65**: A company has VPC flow logs enabled for Its NAT gateway. The company is seeing Action = ACCEPT for inbound traffic that comes from public IP address 198.51.100.2…<br>→ **Đúng:** Open the Amazon CloudWatch console. Select the log group that contains the NAT gateway's elastic network interface and the private instance's elastic network interface. Run a query to filter with the destination address set as "like 203.0" and the source…
- **[Internet - 2] Q74**: A company has introduced a new policy that allows employees to work remotely from their homes if they connect by using a VPN. The company is hosting internal…<br>→ **Đúng:** Create a Client VPN endpoint in the main AWS account. Configure required routing that allows access to internal applications.
- **[Internet - 4] Q4**: A company is creating a centralized logging service running on Amazon EC2 that will receive and analyze logs from hundreds of AWS accounts. AWS PrivateLink is being used…<br>→ **Đúng:** Check that the NACL is attached to the logging service subnet to allow communications to and from the NLB subnets. Check that the NACL is attached to the NLB subnet to allow communications to and from the logging service subnets running on EC2 instances.…
- **[Internet - 4] Q28**: A company uses AWS CloudFormation to deploy applications within multiple VPCs that are all attached to a transit gateway. Each VPC that sends traffic to the public…<br>→ **Đúng:** Create a dedicated transit gateway route table for each VPC attachment. Route traffic only to the authorized VPCs.
- **[Internet - 4] Q32**: A company wants to send data from its on-premises systems to Amazon S3 buckets. The company created the S3 buckets in three different accounts. The company must send the…<br>→ **Đúng:** Establish a networking account in the AWS Cloud. Create a private VPC in the networking account. Set up an AWS Direct Connect connection with a private VIF between the on-premises environment and the private VPC. Create an Amazon S3 interface endpoint in the…
- **[Internet - 4] Q54**: A company's solutions architect is analyzing costs of a multi-application environment. The environment is deployed across multiple Availability Zones in a single AWS…<br>→ **Đúng:** Turn off cross-zone load balancing for the Network Load Balancer in all service provider application deployments. Ensure that service consumer compute resources use the Availability Zone-specific endpoint service by using the endpoint's local DNS name.
- **[Internet - 5] Q5**: A company is migrating an application to the AWS Cloud. The application runs in an on-premises data center and writes thousands of images into a mounted NFS file system…<br>→ **Đúng:** Deploy an AWS DataSync agent to an on-premises server that has access to the NFS file system. Send data over the Direct Connect connection to an AWS PrivateLink interface VPC endpoint for Amazon EFS by using a private VIF. Configure a DataSync scheduled task…
- **[Internet - 5] Q14**: A company operates a fleet of servers on premises and operates a fleet of Amazon EC2 instances in its organization in AWS Organizations. The company's AWS accounts…<br>→ **Đúng:** Create a transit gateway in an AWS account. Share the transit gateway across accounts by using AWS Resource Access Manager (AWS RAM). Configure attachments to all VPCs and VPNs. Setup transit gateway route tables. Associate the VPCs and VPNs with the route…
- **[Internet - 5] Q23**: A team of data scientists is using Amazon SageMaker instances and SageMaker APIs to train machine learning (ML) models. The SageMaker instances are deployed in a VPC…<br>→ **Đúng:** Create an AWS CodeArtifact domain and repository. Add an external connection for public:pypi to the CodeArtifact repository. Configure the Python client to use the CodeArtifact repository. Create a VPC endpoint for CodeArtifact.
- **[Internet - 5] Q35**: A software as a service (SaaS) company uses AWS to host a service that is powered by AWS PrivateLink. The service consists of proprietary software that runs on three…<br>→ **Đúng:** Configure a PrivateLink endpoint service in us-east-1 to use the existing NLB that is in eu-west-2. Grant specific AWS accounts access to connect to the SaaS service.
- **[Internet - 5] Q39**: A company is running a workload that consists of thousands of Amazon EC2 instances. The workload is running in a VPC that contains several public subnets and private…<br>→ **Đúng:** Update the existing VPC, and associate an Amazon-provided IPv6 CIDR block with the VPC and all subnets. Create an egress-only internet gateway. Update the VPC route tables for all private subnets, and add a route for ::/0 to the egress-only internet gateway.
- **[Internet - 5] Q43**: A company hosts a VPN in an on-premises data center. Employees currently connect to the VPN to access files in their Windows home directories. Recently, there has been a…<br>→ **Đúng:** Migrate the home directories to Amazon FSx for Windows File Server. Migrate remote users to AWS Client VPN.
- **[Internet - 5] Q49**: A company runs an intranet application on premises. The company wants to configure a cloud backup of the application. The company has selected AWS Elastic Disaster…<br>→ **Đúng:** Create a VPC that has at least two private subnets, two NAT gateways, and a virtual private gateway. Create an AWS Direct Connect connection and a Direct Connect gateway between the on-premises network and the target AWS network. During configuration of the…
- **[Internet - 5] Q62**: A company is deploying a third-party firewall appliance solution from AWS Marketplace to monitor and protect traffic that leaves the company's AWS environments. The…<br>→ **Đúng:** Deploy two firewall appliances into the shared services VPC, each in a separate Availability Zone. Create a new Gateway Load Balancer in the shared services VPCreate a new target group, and attach it to the new Gateway Load Balancer Add each of the firewall…
- **[Internet - 5] Q65**: A software company needs to create short-lived test environments to test pull requests as part of its development process. Each test environment consists of a single…<br>→ **Đúng:** Create a single VPC for the test environments. Include a transit gateway attachment and related routing configurations. Use AWS CloudFormation to deploy all test environments into the VPC.
- **[Internet - 6] Q30**: A company provides a centralized Amazon EC2 application hosted in a single shared VPC. The centralized application must be accessible from client applications running in…<br>→ **Đúng:** Create a VPC endpoint service using the centralized application NLB and enable the option to require endpoint acceptance. Create a VPC endpoint in each of the business unit VPCs using the service name of the endpoint service. Accept authorized endpoint…
- **[Internet - 6] Q33**: A company has implemented a new security requirement. According to the new requirement, the company must scan all traffic from corporate AWS instances in the company's…<br>→ **Đúng:** Disable source/destination checks on the EC2 instances that run the proxy software.
- **[Internet - 6] Q50**: A company is designing an AWS environment for a manufacturing application. The application has been successful with customers, and the application's user base has…<br>→ **Đúng:** Add a static AWS Site-to-Site VPN as a secondary path to secure data in transit and to provide resilience for the Direct Connect connection.
- **[Internet - 6] Q72**: A company is building an application on AWS. The application sends logs to an Amazon OpenSearch Service cluster for analysis. All data must be stored within a VPC. Some…<br>→ **Đúng:** Configure and set up an AWS Client VPN endpoint. Associate the Client VPN endpoint with a subnet in the VPC. Configure a Client VPN self-service portal. Instruct the developers to connect by using the client for Client VPN.
- **[Internet - 7] Q46**: A company in the United States (US) has acquired a company in Europe. Both companies use the AWS Cloud. The US company has built a new application with a microservices…<br>→ **Đúng:** Create one VPC peering connection for each VPC in us-east-2 to the VPC in eu-west-1. Create the necessary route entries in each VPC so that the traffic is routed through the VPC peering connection.
- **[Internet - 7] Q68**: A company wants to establish a dedicated connection between its on-premises infrastructure and AWS. The company is setting up a 1 Gbps AWS Direct Connect connection to…<br>→ **Đúng:** Advertise the on-premises network prefixes over the transit VIF. Advertise the VPC prefixes from the Direct Connect gateway to the on-premises network over the transit VIF.
- **[Internet - 7] Q70**: A company uses AWS Organizations. The company runs two firewall appliances in a centralized networking account. Each firewall appliance runs on a manually configured…<br>→ **Đúng:** Deploy a Gateway Load Balancer in the centralized networking account. Set up an endpoint service that uses AWS PrivateLink. Create an Auto Scaling group and a launch template that uses the new script as user data to configure the firewall appliances. Create a…
- **[JBS - 3] Q42**: A leading aerospace engineering company is experiencing high growth and demand on their highly available and fault-tolerant cloud services platform that is hosted in…<br>→ **Đúng:** Create another Customer Gateway in a different data center and set up another dual-tunnel VPN connection.
- **[JBS - 3] Q60**: A company runs a finance-related application on a fleet of Amazon EC2 instances inside a private subnet of a VPC in AWS. To access the application, the instances are…<br>→ **Đúng:** Configure Traffic Mirroring on the elastic network interface of the EC2 instances. Send the mirrored traffic to a monitoring appliance for storage and inspection.
- **[JBS - 4] Q3**: A multinational investment bank has multiple cloud architectures across the globe. The company has a VPC in the US East region for their East Coast office and another…<br>→ **Đúng:** Set up an AWS Direct Connect Gateway with two virtual private gateways. Launch and connect the required Private Virtual Interfaces to the Direct Connect Gateway.
- **[JBS - 4] Q9**: A call center company has recently adopted a hybrid architecture in which they need a predictable network performance and reduced bandwidth costs to connect their data…<br>→ **Đúng:** A single AWS Direct Connect and an AWS managed VPN connection to connect your data center with Amazon VPC
- **[JBS - 4] Q21**: A research company hosts its internal applications inside AWS VPCs in multiple AWS Accounts. The internal applications are accessed securely from inside the company…<br>→ **Đúng:** Install the AWS Client VPN on each employee workstation. Create a Client VPN endpoint in the same VPC region in the main AWS account. Update the VPC route configurations to allow communication with the internal applications.
- **[SPM - 1] Q9**: A multi-national retail company has built a hub-and-spoke network with AWS Transit Gateway. VPCs have been provisioned into multiple AWS accounts to facilitate network…<br>→ **Đúng:** Use Centralized VPC Endpoints for connecting with multiple VPCs, also known as shared services VPC
- **[SPM - 1] Q34**: The DevOps team at a leading SaaS company is planning to release the major upgrade of its flagship CRM application in a week. The team is testing the alpha release of…<br>→ **Đúng:** Set up a VPC peering connection between the two VPCs and add a route to the routing table of VPC X that points to the IP address range of 172.30.0.0/16 Set up a VPC peering connection between the two VPCs and add a route to the routing table of VPC Y that…
- **[SPM - 1] Q42**: The CTO at a multi-national retail company is pursuing an IT re-engineering effort to set up a hybrid network architecture that would facilitate the company's envisaged…<br>→ **Đúng:** Set up a Direct Connect to each on-premises data center from different service providers and configure routing to failover to the other on-premises data center's Direct Connect in case one connection fails. Make sure that no VPC CIDR blocks overlap one…
- **[SPM - 1] Q59**: An e-commerce company runs a data archival workflow once a month for its on-premises data center which is connected to the AWS Cloud over a minimally used 10-Gbps Direct…<br>→ **Đúng:** Configure a public virtual interface on the 10-Gbps Direct Connect connection and then copy the data to S3 over the connection
- **[SPM - 2] Q13**: A retail company has a Direct Connect connection between its on-premises data center and its VPC on the AWS Cloud. The company's flagship application runs on an EC2…<br>→ **Đúng:** Configure a public virtual interface on the Direct Connect connection. Create an AWS Site-to-Site VPN between the customer gateway and the virtual private gateway in the VPC
- **[SPM - 2] Q15**: A healthcare company is migrating sensitive data from its on-premises data center to AWS Cloud via an existing AWS Direct Connect connection. The company must ensure…<br>→ **Đúng:** Create a VPC with a virtual private gateway Create an IPsec tunnel between your customer gateway appliance and the virtual private gateway Set up a public virtual interface on the Direct Connect connection
- **[SPM - 2] Q36**: The development team at a company has noticed issues with the Quality of Service (QoS) in the traffic to the EC2 instances hosting a VOIP program. The team needs to…<br>→ **Đúng:** Configure traffic mirroring on the source EC2 instances hosting the VOIP program, set up a network monitoring program on a target EC2 instance and stream the logs to an S3 bucket for further analysis

</details>

<details>
<summary><b>3.2 Route 53, CloudFront & Edge</b>: 26 câu</summary>

- **[Internet - 1] Q27**: A company is running a web application in the AWS Cloud. The application consists of dynamic content that is created on a set of Amazon EC2 instances. The EC2 instances…<br>→ **Đúng:** Provision an ALB, an Auto Scaling group, and EC2 instances in a different AWS Region. Update the CloudFront distribution, and create a second origin for the new ALCreate an origin group for the two origins. Configure one origin as primary and one origin as…
- **[Internet - 1] Q55**: A company uses a service to collect metadata from applications that the company hosts on premises. Consumer devices such as TVs and internet radios access the…<br>→ **Đúng:** Create an Amazon CloudFront distribution for the metadata service. Create an Application Load Balancer (ALB). Configure the CloudFront distribution to forward requests to the ALB. Configure the ALB to invoke the correct Lambda function for each type of…
- **[Internet - 1] Q65**: A company is using multiple AWS accounts. The DNS records are stored in a private hosted zone for Amazon Route 53 in Account A. The company’s applications and databases…<br>→ **Đúng:** Create an authorization to associate the private hosted zone in Account A with the new VPC in Account B. Associate a new VPC in Account B with a hosted zone in Account A. Delete the association authorization in Account A.
- **[Internet - 3] Q2**: A company is building a call center by using Amazon Connect. The company’s operations team is defining a disaster recovery (DR) strategy across AWS Regions. The contact…<br>→ **Đúng:** Provision a new Amazon Connect instance with all existing users and contact flows in a second Region. Create an Amazon Route 53 health check for the URL of the Amazon Connect instance. Create an Amazon CloudWatch alarm for failed health checks. Create an AWS…
- **[Internet - 3] Q14**: A company is updating an application that customers use to make online orders. The number of attacks on the application by bad actors has increased recently. The company…<br>→ **Đúng:** Create an Amazon CloudFront distribution with the ALB as the origin. Add a custom header and random value on the CloudFront domain. Configure the ALB to conditionally forward traffic if the header and value match. Deploy an AWS WAF web ACL that includes an…
- **[Internet - 3] Q53**: A company has deployed an application on AWS Elastic Beanstalk. The application uses Amazon Aurora for the database layer. An Amazon CloudFront distribution serves web…<br>→ **Đúng:** Upload static informational content to the S3 bucket. Set the S3 bucket as a second origin in the original CloudFront distribution. Configure the distribution and the S3 bucket to use an origin access identity (OAI). During the weekly maintenance, edit the…
- **[Internet - 4] Q46**: A company has a complex web application that leverages Amazon CloudFront for global scalability and performance. Over time, users report that the web application is…<br>→ **Đúng:** Deploy a Lambda@Edge function to sort parameters by name and force them to be lowercase. Select the CloudFront viewer request trigger to invoke the function.
- **[Internet - 5] Q52**: An online survey company runs its application in the AWS Cloud. The application is distributed and consists of microservices that run in an automatically scaled Amazon…<br>→ **Đúng:** Create an RSA key pair that is dedicated to the data-handing microservice. Upload the public key to the CloudFront distribution. Create a field-level encryption profile and a configuration. Add the configuration to the CloudFront cache behavior.
- **[Internet - 6] Q41**: A solutions architect has deployed a web application that serves users across two AWS Regions under a custom domain. The application uses Amazon Route 53 latency-based…<br>→ **Đúng:** The setting to evaluate target health is not turned on for the latency alias resource record set that is associated with the domain in the Region where the web servers were stopped. An HTTP health check has not been set up for one or more of the weighted…
- **[Internet - 6] Q43**: A public retail web application uses an Application Load Balancer (ALB) in front of Amazon EC2 instances running across multiple Availability Zones (AZs) in a Region…<br>→ **Đúng:** Configure the target group health check to point at a simple HTML page instead of a product catalog page and the Amazon Route 53 health check against the product page to evaluate full application functionality. Configure Amazon CloudWatch alarms to notify…
- **[Internet - 6] Q58**: A company provides a software as a service (SaaS) application that runs in the AWS Cloud. The application runs on Amazon EC2 instances behind a Network Load Balancer…<br>→ **Đúng:** Create an AWS Global Accelerator standard accelerator. Create a standard accelerator endpoint for the NLB in each additional Region. Provide customers with the Global Accelerator IP address.
- **[Internet - 6] Q62**: A company is developing a web application that runs on Amazon EC2 instances in an Auto Scaling group behind a public-facing Application Load Balancer (ALB). Only users…<br>→ **Đúng:** Create an AWS WAF web ACL. Configure a rule to block any requests that do not originate from the specified country. Associate the rule with the web ACL. Associate the web ACL with the ALB.
- **[JBS - 3] Q9**: A company has a web service portal on which users can perform read and write operations to its semi-structured data. The company wants to refactor the current…<br>→ **Đúng:** Create an Amazon DynamoDB global table to store the semi-structured data on two Regions. Use on-demand capacity mode to allow DynamoDB scaling. Run the web service on an Auto Scaling Amazon ECS Fargate cluster on each region. Place each Fargate cluster behind…
- **[JBS - 3] Q23**: A company has a gaming store platform hosted in its on-premises data center for a whole variety of digital games. The application just experienced downtime last week due…<br>→ **Đúng:** Set up a CloudFront distribution to cache objects from a custom origin to offload traffic from your on-premises environment. Customize your object cache behavior, and choose a time-to-live that will determine how long objects will reside in the cache.
- **[JBS - 3] Q35**: A company has a multi-tier web application hosted in AWS. It leverages Amazon CloudFront to reliably scale and quickly serve requests from users around the world. After…<br>→ **Đúng:** Write a Lamda@Edge function that will normalize the query parameters by sorting them in alphabetical order and converting them into lower case. Deploy this function with the CloudFront distribution and set “viewer request” as the trigger to invoke the…
- **[JBS - 4] Q30**: A consumer goods company runs its e-commerce website entirely on its on-premises data center with high-resolution photos and videos. Due to the unprecedented growth of…<br>→ **Đúng:** Launch a CloudFront web distribution with the URL of the on-premises web application as the origin. Offload the DNS to AWS to handle CloudFront traffic.
- **[JBS - 4] Q71**: A company wants to release a weather forecasting app for mobile users. The application servers generate a weather forecast every 15 minutes, and each forecast update…<br>→ **Đúng:** Use an Amazon EFS volume to store the weather forecast data points. Mount this EFS volume on a fleet of Auto Scaling Amazon EC2 instances behind an Elastic Load Balancer. Create an Amazon CloudFront distribution and point the origin to the ELB. Configure a…
- **[SPM - 1] Q3**: An e-commerce company wants to rollout and test a blue-green deployment for its global application in the next couple of days. Most of the customers use mobile phones…<br>→ **Đúng:** Use AWS Global Accelerator to distribute a portion of traffic to a particular deployment
- **[SPM - 2] Q11**: A development team is designing a system on AWS that will leverage Amazon CloudFront for content caching and for protecting the underlying origin. The team has flagged a…<br>→ **Đúng:** Configure CloudFront to use a custom header and configure an AWS WAF rule on the origin’s Application Load Balancer to accept only traffic that contains that header
- **[SPM - 2] Q17**: A solutions architect is setting up DNS failover configuration for Route 53. The architect needs to use multiple routing policies (such as latency-based and weighted) to…<br>→ **Đúng:** Records without a health check are always considered healthy. If no record is healthy, all records are deemed to be healthy If you're creating failover records in a private hosted zone, you must assign a public IP address to an instance in the VPC to check…
- **[SPM - 2] Q18**: A business has their web application hosted in us-east-1 region. Recently, the business has added another region us-east-2 , and has configured Route53 to direct user…<br>→ **Đúng:** HTTPS health checks don't validate SSL/TLS certificates, so checks don't fail if a certificate is invalid or expired If you configure Route 53 to use the HTTPS protocol to check the health of your endpoint, then that endpoint must support TLS After a Route 53…
- **[SPM - 2] Q22**: An e-commerce company manages its flagship applications on AWS. The Amazon EC2 instances running the applications are fronted by an Application Load Balancer (ALB).…<br>→ **Đúng:** Use Host conditions in ALB listener to route ecomm.com to appropriate target groups Use Host conditions in ALB listener to route *.ecomm.com to appropriate target groups
- **[SPM - 2] Q32**: A solutions architect at a retail company has configured a private hosted zone using Route 53. The architect needs to configure health checks for record sets within the…<br>→ **Đúng:** Configure a CloudWatch metric that checks the status of the EC2 StatusCheckFailed metric, add an alarm to the metric, and then configure a health check that monitors the state of the alarm
- **[SPM - 2] Q38**: A global multi-player gaming application runs on UDP protocol and it needs to add functionality where you can assign multiple players to a single session on a game…<br>→ **Đúng:** Use custom routing accelerator of Global Accelerator to deterministically route one or more users to a specific instance using VPC subnet endpoints
- **[SPM - 2] Q53**: A company is building an on-demand streaming application on AWS Cloud. The company has chosen Amazon S3 as its storage service and moved the existing videos to an Amazon…<br>→ **Đúng:** Use AWS Elemental MediaConvert for file-based video processing and Amazon CloudFront for delivery. Use video streaming protocols like Apple’s HTTP Live Streaming (HLS) and create a manifest file. Point the CloudFront distribution at the manifest
- **[SPM - 2] Q56**: An e-commerce company runs its flagship website on its on-premises Linux servers. Recently, the company suffered outages after announcing huge discounts on its website.…<br>→ **Đúng:** Create a CloudFront distribution and configure CloudFront to cache objects from a custom origin. This will offload some traffic from the on-premises servers. Customize CloudFront cache behavior by setting Time To Live (TTL) to suit your business requirement

</details>

<details>
<summary><b>3.3 Multi-account Governance & IAM</b>: 35 câu</summary>

- ⚠️ **[Internet - 6] Q60**: An enterprise company is building an infrastructure services platform for its users. The company has the following requirements: •Provide least privilege access to users…<br>→ **Đúng:** Develop infrastructure services using AWS CloudFormation templates. Upload each template as an AWS Service Catalog product to portfolios created in a central AWS account. Share these portfolios with the Organizations structure created for the company. Allow…
- **[Internet - 1] Q32**: A company with several AWS accounts is using AWS Organizations and service control policies (SCPs). An administrator created the following SCP and has attached it to an…<br>→ **Đúng:** Instruct the developers to add Amazon S3 permissions to their IAM entities.
- **[Internet - 1] Q39**: A company has an organization in AWS Organizations. The company is using AWS Control Tower to deploy a landing zone for the organization. The company wants to implement…<br>→ **Đúng:** Enable the appropriate guardrail from the list of strongly recommended guardrails in AWS Control Tower. Apply the guardrail to the production OU.
- **[Internet - 1] Q45**: A company has an environment that has a single AWS account. A solutions architect is reviewing the environment to recommend what the company could improve specifically…<br>→ **Đúng:** Create an organization in AWS Organizations. Turn on all features for the organization. Create and configure an AD Connector to connect to the company’s on-premises Active Directory. Configure IAM Identity Center and set the AD Connector as the identity…
- **[Internet - 1] Q53**: A company uses AWS Organizations with a single OU named Production to manage multiple accounts. All accounts are members of the Production OU. Administrators use deny…<br>→ **Đúng:** Create a temporary OU named Onboarding for the new account. Apply an SCP to the Onboarding OU to allow AWS Config actions. Move the organization’s root SCP to the Production OU. Move the new account to the Production OU when adjustments to AWS Config are…
- **[Internet - 2] Q18**: A company wants to migrate to AWS. The company wants to use a multi-account structure with centrally managed access to all accounts and applications. The company also…<br>→ **Đúng:** Deploy a landing zone environment by using AWS Control Tower. Enroll accounts and invite existing accounts into the resulting organization in AWS Organizations. Create transit gateways and transit gateway VPC attachments in each account. Configure appropriate…
- **[Internet - 2] Q31**: A company uses AWS Organizations for a multi-account setup in the AWS Cloud. The company uses AWS Control Tower for governance and uses AWS Transit Gateway for VPC…<br>→ **Đúng:** In the application account, create an IAM role that is named DBA-Secret. Grant the role the required permissions to access the secrets. In the DBA account, create an IAM role that is named DBA-Admin. Grant the DBA-Admin role the required permissions to assume…
- **[Internet - 2] Q59**: A company has its cloud infrastructure on AWS. A solutions architect needs to define the infrastructure as code. The infrastructure is currently deployed in one AWS…<br>→ **Đúng:** Use AWS Organizations and AWS CloudFormation StackSets. Deploy a Cloud Formation template from an account that has the necessary IAM permissions.
- **[Internet - 3] Q25**: A solutions architect has implemented a SAML 2.0 federated identity solution with their company's on-premises identity provider (IdP) to authenticate users' access to…<br>→ **Đúng:** The IAM roles created for the federated users' or federated groups' trust policy have set the SAML provider as the principal. B. Test users are not in the AWSFederatedUsers group in the company's IdP. The web portal calls the AWS STS AssumeRoleWithSAML API…
- **[Internet - 4] Q10**: A company has many separate AWS accounts and uses no central billing or management. Each AWS account hosts services for different departments in the company. The company…<br>→ **Đúng:** Create a new AWS account to serve as a management account. Deploy an organization in AWS Organizations. Invite each existing AWS account to join the organization. Ensure that each account accepts the invitation. Deploy AWS IAM Identity Center (AWS Single…
- **[Internet - 4] Q14**: A company uses AWS Organizations to manage more than 1,000 AWS accounts. The company has created a new developer organization. There are 540 developer member accounts…<br>→ **Đúng:** From the management account, remove each developer account from the old organization using the RemoveAccountFromOrganization operation in the Organizations API. Call the InviteAccountToOrganization operation in the Organizations API from the new developer…
- **[Internet - 4] Q18**: A company wants to optimize AWS data-transfer costs and compute costs across developer accounts within the company's organization in AWS Organizations. Developers can…<br>→ **Đúng:** Create an AWS Service Catalog portfolio that users can use to create an approved VPC configuration with S3 gateway endpoints and approved EC2 instances. Share the portfolio with the developer accounts. Configure an AWS Service Catalog launch constraint to use…
- **[Internet - 4] Q60**: A company is designing an AWS Organizations structure. The company wants to standardize a process to apply tags across the entire organization. The company will require…<br>→ **Đúng:** Use an SCP to deny the creation of resources that do not have the required tags. Create a tag policy that includes the tag values that the company has assigned to each OU. Attach the tag policies to the OUs.
- **[Internet - 4] Q70**: A company needs to create and manage multiple AWS accounts for a number of departments from a central location. The security team requires read-only access to all…<br>→ **Đúng:** Use the OrganizationAccountAccessRole IAM role to create a new IAM role with read-only access in each member account. Establish a trust relationship between the IAM role in each member account and the security account. Ask the security team to use the IAM…
- **[Internet - 5] Q8**: A company is migrating its infrastructure to the AWS Cloud. The company must comply with a variety of regulatory standards for different projects. The company needs a…<br>→ **Đúng:** Create an organization in AWS Organizations. Enable AWS Control Tower on the organization. Review included controls (guardrails) for SCPs. Check AWS Config for areas that require additions. Add OUs as necessary. Connect AWS IAM Identity Center (AWS Single…
- **[Internet - 5] Q11**: A company runs applications in hundreds of production AWS accounts. The company uses AWS Organizations with all features enabled and has a centralized backup operation…<br>→ **Đúng:** Implement cross-account backup with AWS Backup vaults in designated non-production accounts. Add an SCP that restricts the modification of AWS Backup vaults. Implement AWS Backup Vault Lock in compliance mode. C. Implement least privilege access for the IAM…
- **[Internet - 5] Q38**: A company is managing many AWS accounts by using an organization in AWS Organizations. Different business units in the company run applications on Amazon EC2 instances.…<br>→ **Đúng:** Create an SCP and attach the SCP to the root of the organization. Include the following statement in the SCP: { "Sid": "DenyEC2Creation", "Effect": "Deny", "Action": [ "ec2:RunInstances" ], "Resource": [ "arn:aws:ec2:*:*:instance/*" ], "Condition": { "Null":…
- **[Internet - 5] Q45**: A company hosts an intranet web application on Amazon EC2 instances behind an Application Load Balancer (ALB). Currently, users authenticate to the application against…<br>→ **Đúng:** Configure an Amazon Cognito user pool. Configure the user pool with a federated identity provider (ldP) that has metadata from the directory. Create an app client. Associate the app client with the user pool. Create a listener rule for the ALSpecify the…
- **[Internet - 5] Q47**: A company is using multiple AWS accounts and has multiple DevOps teams running production and non-production workloads in these accounts. The company would like to…<br>→ **Đúng:** Use a Deny list strategy. Review the Access Advisor in AWS IAM to determine services recently used Define organizational units (OUs) and place the member accounts in the OUs.
- **[Internet - 5] Q58**: A company is using AWS Organizations with a multi-account architecture. The company's current security configuration for the account architecture includes SCPs,…<br>→ **Đúng:** Configure the SCP for Account A to allow the action. Configure the identity-based policy on the user in Account A to allow the action. Configure the trust policy on the target role in Account B to allow the action.
- **[Internet - 5] Q68**: A company’s solutions architect needs to provide secure Remote Desktop connectivity to users for Amazon EC2 Windows instances that are hosted in a VPC. The solution must…<br>→ **Đúng:** Configure AWS IAM Identity Center (AWS Single Sign-On) to integrate with the on-premises Active Directory by using the AWS Directory Service for Microsoft Active Directory AD Connector. Configure permission sets against user groups for access to AWS Systems…
- **[Internet - 5] Q75**: A company is rearchitecting its applications to run on AWS. The company’s infrastructure includes multiple Amazon EC2 instances. The company's development team needs…<br>→ **Đúng:** Create an AWS Directory Service for Microsoft Active Directory implementation. Launch an EC2 instance. Connect to and use the EC2 instance for domain security configuration tasks.
- **[Internet - 6] Q1**: A company is creating a solution that can move 400 employees into a remote working environment in the event of an unexpected disaster. The user desktops have a mix of…<br>→ **Đúng:** Use Amazon WorkSpaces for the cloud desktop service. Set up a VPN connection to the on-premises network. Create an AD Connector, and connect to the on-premises Active Directory. Configure a RADIUS server for MFA.
- **[Internet - 6] Q9**: A company is using AWS Control Tower to manage AWS accounts in an organization in AWS Organizations. The company has an OU that contains accounts. The company must…<br>→ **Đúng:** Create an SCP that prevents the launch of instances that have a public IP address. Additionally, configure the SCP to prevent the attachment of a public IP address to existing instances. Attach the SCP to the OU.
- **[Internet - 6] Q10**: A company is deploying a third-party web application on AWS. The application is packaged as a Docker image. The company has deployed the Docker image as an AWS Fargate…<br>→ **Đúng:** Create a user pool in Amazon Cognito. Configure the pool for the application. Populate the pool with the required users. Configure the pool to require MFConfigure a listener rule on the ALB to require authentication through the Amazon Cognito hosted UI.
- ✅ **[Internet - 6] Q18**: A company creates an AWS Control Tower landing zone to manage and govern a multi-account AWS environment. The company's security team will deploy preventive controls and…<br>→ **Đúng:** Enable AWS Security Hub for the organization in AWS Organizations. Designate one AWS account as the delegated administrator for Security Hub.
- **[Internet - 6] Q40**: A company has multiple lines of business (LOBs) that roll up to the parent company. The company has asked its solutions architect to develop a solution with the…<br>→ **Đúng:** Use AWS Organizations to create a single organization in the parent account. Then, invite each LOB's AWS account to join the organization. Create an SCP that allows only approved services and features, then apply the policy to the LOB accounts.
- ✅ **[Internet - 6] Q53**: A large company is migrating its entire IT portfolio to AWS. Each business unit in the company has a standalone AWS account that supports both development and test…<br>→ **Đúng:** Use AWS Organizations to create a new organization from a chosen payer account and define an organizational unit hierarchy. Invite the existing accounts to join the organization and create new accounts using Organizations. Enable all features of AWS…
- **[Internet - 6] Q65**: A financial company needs to create a separate AWS account for a new digital wallet application. The company uses AWS Organizations to manage its accounts. A solutions…<br>→ **Đúng:** From the management account, switch roles to assume the OrganizationAccountAccessRole role with the account ID of the new member account. Set up the IAM users as required.
- **[Internet - 7] Q4**: A solutions architect is creating an AWS CloudFormation template from an existing manually created non-production AWS environment. The CloudFormation template can be…<br>→ **Đúng:** In the parent account, edit the trust policy for the role that the EC2 instance needs to assume. Ensure that the target role ARN in the existing statement that allows the sts:AssumeRole action is correct. Save the trust policy.
- **[Internet - 7] Q32**: A company has an application that uses Amazon EC2 instances in an Auto Scaling group. The quality assurance (QA) department needs to launch a large number of short-lived…<br>→ **Đúng:** Create an AWS Service Catalog product from the environment template. Add a launch constraint to the product with the existing role. Give users in the QA department permission to use AWS Service Catalog APIs only. Train users to launch the template from the…
- **[JBS - 3] Q58**: A financial services company operates a multi-account AWS environment managed by AWS Control Tower. The security team must centralize the management of compliance and…<br>→ **Đúng:** Create a new member account in AWS Organizations. Enable AWS Security Hub and designate the account as the delegated administrator.
- **[SPM - 1] Q20**: A global healthcare company wants to develop a solution called Health Information Systems (HIS) on AWS Cloud that would allow the providers, payers, and government…<br>→ **Đúng:** If a user or role has an IAM permission policy that grants access to an action that is either not allowed or explicitly denied by the applicable SCPs, the user or role can't perform that action SCPs affect all users and roles in attached accounts, including…
- **[SPM - 2] Q3**: A pharmaceutical company uses AWS Cloud to run multiple workloads with each workload managed by its software development team. The company leverages AWS Organizations…<br>→ **Đúng:** During SAML-based federation, pass an attribute for DevelopmentDept as an AWS Security Token Service (AWS STS) session tag. The policy of the assumed IAM role used by the developers should be updated with a deny action and a StringNotEquals condition for the…
- **[SPM - 2] Q66**: You have hired a Cloud consulting agency, Example Corp, to monitor your AWS account and help optimize costs. To track daily spending, Example Corp needs access to your…<br>→ **Đúng:** Create an IAM role in your AWS account with a trust policy that trusts the Partner (Example Corp). Take a unique external ID value from Example Corp and include this external ID condition in the role’s trust policy

</details>

<details>
<summary><b>3.4 Security, Encryption & Compliance</b>: 26 câu</summary>

- **[Internet - 1] Q3**: A company has registered 10 new domain names. The company uses the domains for online marketing. The company needs a solution that will redirect online visitors to a…<br>→ **Đúng:** Create an AWS Lambda function that uses the JSON document in combination with the event message to look up and respond with a redirect URL. Create an Amazon CloudFront distribution. Deploy a Lambda@Edge function. Create an SSL certificate by using AWS…
- **[Internet - 1] Q24**: A company is planning to host a web application on AWS and wants to load balance the traffic across a group of Amazon EC2 instances. One of the security requirements is…<br>→ **Đúng:** Place the EC2 instances behind an Application Load Balancer (ALB) Provision an SSL certificate using AWS Certificate Manager (ACM), and associate the SSL certificate with the ALB. Provision a third-party SSL certificate and install it on each EC2 instance.…
- **[Internet - 1] Q26**: A health insurance company stores personally identifiable information (PII) in an Amazon S3 bucket. The company uses server-side encryption with S3 managed encryption…<br>→ **Đúng:** In the S3 bucket properties, change the default encryption to server-side encryption with AWS KMS managed encryption keys (SSE-KMS). Set an S3 bucket policy to deny unencrypted PutObject requests. Use the AWS CLI to re-upload all objects in the S3 bucket.
- **[Internet - 2] Q53**: A company recently completed the migration from an on-premises data center to the AWS Cloud by using a replatforming strategy. One of the migrated servers is running a…<br>→ **Đúng:** Configure the application to connect to Amazon SES by using STARTTLS. Obtain Amazon SES SMTP credentials. Use the credentials to authenticate with Amazon SES.
- **[Internet - 2] Q71**: A solutions architect needs to implement a client-side encryption mechanism for objects that will be stored in a new Amazon S3 bucket. The solutions architect created a…<br>→ **Đúng:** kms:GenerateDataKey
- **[Internet - 2] Q72**: A company has developed a web application. The company is hosting the application on a group of Amazon EC2 instances behind an Application Load Balancer. The company…<br>→ **Đúng:** Set the action of the web ACL rules to Count. Enable AWS WAF logging. Analyze the requests for false positives. Modify the rules to avoid any false positive. Over time, change the action of the web ACL rules from Count to Block.
- **[Internet - 3] Q24**: A company is using an organization in AWS Organizations to manage hundreds of AWS accounts. A solutions architect is working on a solution to provide baseline protection…<br>→ **Đúng:** Enable AWS Config in all accounts Enable all features for the organization Use AWS Firewall Manager to deploy AWS WAF rules in all accounts for all CloudFront distributions
- **[Internet - 3] Q59**: A company has a website that runs on Amazon EC2 instances behind an Application Load Balancer (ALB). The instances are in an Auto Scaling group. The ALB is associated…<br>→ **Đúng:** Deploy AWS Shield Advanced in addition to AWS WAF. Add the ALB as a protected resource.
- **[Internet - 5] Q44**: A company has multiple AWS accounts. The company recently had a security audit that revealed many unencrypted Amazon Elastic Block Store (Amazon EBS) volumes attached to…<br>→ **Đúng:** Create an organization in AWS Organizations. Set up AWS Control Tower, and turn on the strongly recommended controls (guardrails). Join all accounts to the organization. Categorize the AWS accounts into OUs. Create a snapshot of each unencrypted volume.…
- **[Internet - 5] Q70**: A research company is running daily simulations in the AWS Cloud to meet high demand. The simulations run on several hundred Amazon EC2 instances that are based on…<br>→ **Đúng:** Launch new EC2 instances without setting up any SSH key for the instances. Set up EC2 Instance Connect on each instance. Create a new IAM policy, and attach it to the engineers’ IAM role with an Allow statement for the SendSSHPublicKey action. Instruct the…
- **[Internet - 7] Q12**: A company hosts its primary API on AWS by using an Amazon API Gateway API and AWS Lambda functions that contain the logic for the API methods. The company’s internal…<br>→ **Đúng:** Use AWS WAF to protect the API Gateway API. Configure Amazon Inspector to analyze the legacy API. Configure Amazon GuardDuty to monitor for malicious attempts to access the APIs.
- **[Internet - 7] Q42**: A company has deployed applications to thousands of Amazon EC2 instances in an AWS account. A security audit discovers that several unencrypted Amazon Elastic Block…<br>→ **Đúng:** Configure the AWS Config managed rule that identifies unencrypted EBS volumes. Configure an automatic remediation action. Associate an AWS Systems Manager Automation runbook that includes the steps to create a new encrypted EBS volume. Modify the AWS account…
- **[JBS - 3] Q1**: A company runs a suite of web applications in AWS. The application is hosted in an Auto Scaling group of On-Demand Amazon EC2 instances behind an Application Load…<br>→ **Đúng:** Create a new CloudFront web distribution and configure it to serve HTTPS requests using dedicated IP addresses in order to associate your alternate domain names with a dedicated IP address in each CloudFront edge location. Upload all SSL certificates of the…
- **[JBS - 3] Q7**: A financial services company uses hardware security modules (HSMs) to generate encryption master keys. Since the company application logs include personally identifiable…<br>→ **Đúng:** Using AWS CLI, create a new KMS key with no key material and use EXTERNAL as the origin of the key. Generate a key from the on-premises HSMs and import it as KMS key using the public key and import token from AWS. Apply an Amazon S3 bucket policy on the…
- **[JBS - 3] Q45**: A leading commercial bank has a hybrid network architecture and is extensively using AWS for its day-to-day operations. The bank uses an Amazon S3 bucket to store…<br>→ **Đúng:** For Amazon S3 REST API calls, use the following HTTP Request Headers: x-amz-server-side​-encryption​-customer-algorithm x-amz-server-side​-encryption​-customer-key x-amz-server-side​-encryption​-customer-key-MD5 For presigned URLs, specify the algorithm using…
- **[JBS - 4] Q12**: A company wants to have a secure content management solution that can be accessed by its external custom applications via API calls. The solutions architect has been…<br>→ **Đúng:** Use Amazon WorkDocs for document storage and utilize its user access management, version control, and built-in encryption. Integrate the Amazon WorkDocs Content Manager to the external custom applications. Develop a rollback feature to replace the current…
- **[JBS - 4] Q69**: A company runs its travel and tours website on AWS. The application only supports HTTP at the moment. To improve their SEO ranking and provide more security for their…<br>→ **Đúng:** Store the SSL certificate in IAM and authorize access only to the Security team using an IAM policy. Configure the Application Load Balancer to use the SSL certificate instead of the EC2 instances.
- **[SPM - 1] Q6**: An IT company wants to move all its clients belonging to the regulated and security-sensitive industries such as financial services and healthcare to the AWS Cloud as it…<br>→ **Đúng:** Enable trails and set up CloudTrail events to review and monitor management activities of all AWS accounts by logging these activities into CloudWatch Logs using a KMS key. Ensure that CloudTrail is enabled for all accounts as well as all available AWS…
- **[SPM - 1] Q14**: A web-hosting startup manages more than 500 public web applications on AWS Cloud which are deployed in a single AWS Region. The fully qualified domain names (FQDNs) of…<br>→ **Đúng:** Generate a separate certificate for each FQDN in each AWS Region using AWS Certificate Manager. Associate the certificates with the corresponding ALBs in the relevant AWS Region
- **[SPM - 2] Q7**: A healthcare company has to maintain a log of all transactions for audit and compliance purposes. The company is planning stringent security measures for all of its…<br>→ **Đúng:** Use Amazon S3 MFA Delete on the S3 bucket that holds CloudTrail logs and digest files Enable CloudTrail log file integrity validation
- **[SPM - 2] Q9**: A financial services firm intends to migrate its IT operations to AWS. The security team is establishing a framework to ensure that AWS best practices are being…<br>→ **Đúng:** Leverage AWS Config rules for auditing changes to AWS resources periodically and monitor the compliance of the configuration. Set up AWS Config custom rules using AWS Lambda to create a test-driven development approach, and finally automate the evaluation of…
- **[SPM - 2] Q20**: A social media company is migrating its legacy web application to the AWS Cloud. Since the application is complex and may take several months to refactor, the CTO at the…<br>→ **Đúng:** The SSL certificate on the legacy web application server has expired. Reissue the SSL certificate on the web server that is signed by a globally recognized certificate authority (CA). Install the full certificate chain onto the legacy web application server
- **[SPM - 2] Q71**: An e-commerce company has a three-tier web application with separate subnets for Web, Application and Database tiers. The CTO at the company wants to monitor any…<br>→ **Đúng:** Amazon Inspector Amazon SNS
- **[SPM - 3] Q4**: A financial services company wants to set up an AWS WAF-based solution to manage AWS WAF rules across multiple AWS accounts that are structured under different…<br>→ **Đúng:** Create an AWS Organizations organization-wide AWS Config rule that mandates all resources in the selected OUs to be associated with the AWS WAF rules. Configure automated remediation actions by using AWS Systems Manager Automation documents to fix…
- **[SPM - 3] Q14**: The development team at a company needs to implement a client-side encryption mechanism for objects that will be stored in a new Amazon S3 bucket. The team created a CMK…<br>→ **Đúng:** kms:GenerateDataKey
- **[SPM - 3] Q26**: An Amazon Simple Storage Service (Amazon S3) bucket has been configured to host a static website. While using the S3 static website endpoint, the testing team has…<br>→ **Đúng:** The AWS account that owns the bucket must also own the object Objects can't be encrypted by AWS Key Management Service (AWS KMS)

</details>

<details>
<summary><b>3.5 Storage (S3/EFS/FSx/Gateway/EBS)</b>: 47 câu</summary>

- ⚠️ **[Internet - 6] Q37**: A retail company is operating its ecommerce application on AWS. The application runs on Amazon EC2 instances behind an Application Load Balancer (ALB). The company uses…<br>→ **Đúng:** Create an Amazon S3 bucket. Configure the S3 bucket to host a static webpage. Upload the custom error pages to Amazon S3. Add a custom error response by configuring a CloudFront custom error page. Modify DNS records to point to a publicly accessible web page.
- **[Internet - 1] Q18**: A company is using Amazon OpenSearch Service to analyze data. The company loads data into an OpenSearch Service cluster with 10 data nodes from an Amazon S3 bucket that…<br>→ **Đúng:** Reduce the number of data nodes in the cluster to 2 Add UltraWarm nodes to handle the expected capacity. Configure the indexes to transition to UltraWarm when OpenSearch Service ingests the data. Transition the input data to S3 Glacier Deep Archive after 1…
- **[Internet - 1] Q60**: A retail company is operating its ecommerce application on AWS. The application runs on Amazon EC2 instances behind an Application Load Balancer (ALB). The company uses…<br>→ **Đúng:** Create an Amazon S3 bucket. Configure the S3 bucket to host a static webpage. Upload the custom error pages to Amazon S3. Add a custom error response by configuring a CloudFront custom error page. Modify DNS records to point to a publicly accessible web page.
- **[Internet - 1] Q70**: A company is planning to store a large number of archived documents and make the documents available to employees through the corporate intranet. Employees will access…<br>→ **Đúng:** Create an Amazon S3 bucket. Configure the S3 bucket to use the S3 One Zone-Infrequent Access (S3 One Zone-IA) storage class as default. Configure the S3 bucket for website hosting. Create an S3 interface endpoint. Configure the S3 bucket to allow access only…
- **[Internet - 2] Q58**: A company uses Amazon S3 to store files and images in a variety of storage classes. The company's S3 costs have increased substantially during the past year. A solutions…<br>→ **Đúng:** Use Amazon S3 Storage Lens. Upgrade the default dashboard to include advanced metrics for storage trends.
- **[Internet - 3] Q11**: A solutions architect is creating an application that stores objects in an Amazon S3 bucket. The solutions architect must deploy the application in two AWS Regions that…<br>→ **Đúng:** Create an S3 Multi-Region Access Point Change the application to refer to the Multi-Region Access Point Configure two-way S3 Cross-Region Replication (CRR) between the two S3 buckets Enable S3 Versioning for each S3 bucket
- **[Internet - 3] Q30**: A company is designing a new website that hosts static content. The website will give users the ability to upload and download large files. According to company…<br>→ **Đúng:** Turn on S3 server-side encryption for the S3 bucket that the web application uses. Create a bucket policy that denies any unencrypted operations in the S3 bucket that the web application uses. Configure redirection of HTTP requests to HTTPS requests in…
- **[Internet - 3] Q51**: A company has migrated an application from on premises to AWS. The application frontend is a static website that runs on two Amazon EC2 instances behind an Application…<br>→ **Đúng:** Move the application frontend to a static website that is hosted on Amazon S3. Deploy the backend Python application to general purpose burstable EC2 instances that have the same number of cores as the existing EC2 instances.
- **[Internet - 4] Q15**: A company’s interactive web application uses an Amazon CloudFront distribution to serve images from an Amazon S3 bucket. Occasionally, third-party tools ingest corrupted…<br>→ **Đúng:** Use an S3 event notification that invokes an AWS Lambda function.
- **[Internet - 4] Q51**: A company provides auction services for artwork and has users across North America and Europe. The company hosts its application in Amazon EC2 instances in the us-east-1…<br>→ **Đúng:** Configure the buckets to use S3 Transfer Acceleration.
- **[Internet - 4] Q67**: A company has a data lake in Amazon S3 that needs to be accessed by hundreds of applications across many AWS accounts. The company's information security policy states…<br>→ **Đúng:** Create an S3 access point for each application in the AWS account that owns the S3 bucket. Configure each access point to be accessible only from the application’s VPC. Update the bucket policy to require access from an access point. Create a gateway endpoint…
- **[Internet - 5] Q24**: A solutions architect works for a government agency that has strict disaster recovery requirements. All Amazon Elastic Block Store (Amazon EBS) snapshots are required to…<br>→ **Đúng:** Configure a policy in Amazon Data Lifecycle Manager (Amazon DLM) to run once daily to copy the EBS snapshots to the additional Regions.
- **[Internet - 5] Q36**: A company needs to monitor a growing number of Amazon S3 buckets across two AWS Regions. The company also needs to track the percentage of objects that are encrypted in…<br>→ **Đúng:** Use the S3 Storage Lens default dashboard to track bucket and encryption metrics. Give the compliance teams access to the dashboard directly in the S3 console.
- **[Internet - 5] Q50**: A company that provides image storage services wants to deploy a customer-facing solution to AWS. Millions of individual customers will use the solution. The solution…<br>→ **Đúng:** Use Amazon Simple Queue Service (Amazon SQS) to process the S3 event that occurs when a user stores an image. Run an AWS Lambda function that resizes the image and stores the resized file in an S3 bucket that uses S3 Standard-Infrequent Access (S3…
- **[Internet - 5] Q57**: A solutions architect is reviewing a company's process for taking snapshots of Amazon RDS DB instances. The company takes automatic snapshots every day and retains the…<br>→ **Đúng:** Turn on the cross-account management feature in AWS Backup. Create a backup plan that specifies the frequency and retention requirements. Add a tag to the DB instances. Apply the backup plan by using tags. Use AWS Backup to monitor the status of the backups.
- **[Internet - 6] Q24**: A company is planning to migrate an application from on premises to the AWS Cloud. The company will begin the migration by moving the application’s underlying data…<br>→ **Đúng:** Create an S3 bucket for the application. Deploy a new AWS Storage Gateway file gateway on an on-premises VM. Create a new file share that stores data in the S3 bucket and is associated with the file gateway. Copy the data from the on-premises storage to the…
- **[Internet - 6] Q29**: A company runs a highly available data collection application on Amazon EC2 in the eu-north-1 Region. The application collects data from end-user devices and writes…<br>→ **Đúng:** Create an S3 bucket in each of the two new Regions. Set the application in each new Region to upload to its respective S3 bucket. Set up S3 Cross-Region Replication to replicate data to the S3 bucket in eu-north-1.
- **[Internet - 6] Q52**: A company has a web application that securely uploads pictures and videos to an Amazon S3 bucket. The company requires that only authenticated users are allowed to post…<br>→ **Đúng:** Enable an S3 Transfer Acceleration endpoint on the S3 bucket. Use the endpoint when generating the presigned URL. Have the browser interface upload the objects to this URL using the S3 multipart upload API.
- **[Internet - 7] Q22**: Accompany runs an application on Amazon EC2 and AWS Lambda. The application stores temporary data in Amazon S3. The S3 objects are deleted after 24 hours. The company…<br>→ **Đúng:** Create a Lambda function to delete objects from an S3 bucket. Add the Lambda function as a custom resource in the CloudFormation stack with a DependsOn attribute that points to the S3 bucket resource.
- **[Internet - 7] Q36**: A media company has a 30-T8 repository of digital news videos. These videos are stored on tape in an on-premises tape library and referenced by a Media Asset Management…<br>→ **Đúng:** Set up an AWS Storage Gateway, file gateway appliance on-premises. Use the MAM solution to extract the videos from the current archive and push them into the file gateway. Use the catalog of faces to build a collection in Amazon Rekognition. Build an AWS…
- **[JBS - 3] Q5**: A visual effects studio has over 40-TB worth of video files stored in the company's on-premises tape library. The tape drives are managed by a Media Asset Management…<br>→ **Đúng:** Provision an AWS Storage Gateway – file gateway appliance on the on-premises data center. Configure the MAM solution to extract the video files from the current tape archives and move them to the file gateway share which is then synced to Amazon S3. Use…
- **[JBS - 3] Q16**: A company is running a financial modeling application on the AWS cloud. The application tier runs on an Auto Scaling group of Amazon EC2 instances. A separate EC2…<br>→ **Đúng:** For the data tier, create an Amazon S3 bucket and move the objects of the existing shared file system to it. Use S3 Intelligent-Tiering Storage class to save costs. Use lazy-loading on an Amazon FSx for Lustre filesystem to import the contents of the S3…
- **[JBS - 3] Q38**: A financial company is building a new online document portal system that allows its employees and developers to upload yearly and bi-annual corporate earnings report…<br>→ **Đúng:** The required AWS credentials in the ~/.aws/credentials configuration file located on the EC2 instances of the online portal were misconfigured The expiration date of the pre-signed URL is incorrectly set to expire too quickly and thus, may have already…
- **[JBS - 3] Q44**: A small telecommunications company has recently adopted a hybrid cloud architecture with AWS. They are storing static files of their on-premises web application on a 5…<br>→ **Đúng:** Generate an EBS snapshot of the static content from the AWS Storage Gateway service. Afterward, restore it to an EBS volume that you can then attach to the EC2 instance where the application server is hosted.
- **[JBS - 3] Q56**: A fashion company in France sells bags, clothes, and other luxury items in its online web store. The online store is currently hosted on the company’s on-premises data…<br>→ **Đúng:** Launch an EC2 instance for both the NGINX server as well as for the database. Attach EBS volumes to the EC2 instance of the database and then use the Data Lifecycle Manager to automatically create scheduled snapshots against the EBS volumes.
- **[JBS - 3] Q63**: A major telecommunications company is planning to set up a disaster recovery solution for its Amazon Redshift cluster which is being used by its online data analytics…<br>→ **Đúng:** Set up a snapshot copy grant for a master key in the destination region and enable cross-region snapshots in your Redshift cluster to copy snapshots of the cluster to another region.
- **[JBS - 3] Q69**: A multinational corporation has recently acquired a smaller company. The solutions architect was instructed to consolidate the multiple AWS accounts of both entities…<br>→ **Đúng:** The SCP is the root cause since it does not explicitly allow the required action that would enable the account to create an S3 bucket.
- **[JBS - 4] Q13**: A data analytics company is running a Redshift data warehouse for one of its major clients. In compliance with the Business Continuity Program of the client, they need…<br>→ **Đúng:** Configure Redshift to have automatic snapshots and do a cross-region snapshot copy to automatically replicate the current production cluster to the disaster recovery region.
- **[JBS - 4] Q50**: A travel and tourism company has multiple AWS accounts that are assigned to various departments. The marketing department stores the images and media files that are used…<br>→ **Đúng:** Ensure that the mgmt_reviewer IAM role policy includes read permissions to the Amazon S3 bucket and a decrypt permission to the custom AWS KSM key. Update the custom AWS KMS key policy in the Marketing account to include decrypt permission for the…
- **[JBS - 4] Q54**: A leading aerospace engineering company has over 1 TB of aeronautical data stored on the corporate file server of its on-premises network. This data is used by a lot of…<br>→ **Đúng:** 1. Synchronize the on-premises data to an S3 bucket one week before the migration schedule using the AWS CLI's S3 sync command. 2. Perform a final synchronization task on Friday after the end of business hours. 3. Set up your application hosted in a large EC2…
- **[SPM - 1] Q5**: A company has built a serverless electronic document management system for users to upload their documents. The system also has a web application that connects to an…<br>→ **Đúng:** Enable S3 Transfer Acceleration on the S3 bucket and configure the web application to use the Transfer Acceleration endpoints Change the API Gateway Regional endpoints to edge-optimized endpoints
- **[SPM - 1] Q16**: A multi-national company uses Amazon S3 as its data lake to store the data that flows into its business. This data is both structured and semi-structured and is…<br>→ **Đúng:** Create a gateway endpoint for Amazon S3 in the data lake VPC. Attach an endpoint policy to allow access to the S3 bucket only via the access points. Specify the route table that is used to access the bucket In the AWS account that owns the S3 buckets, create…
- **[SPM - 1] Q22**: A blog hosting company has an existing SaaS product architected as an on-premises three-tier web application. The blog content is posted and updated several times a day…<br>→ **Đúng:** Attach an EFS file system to the on-premises servers to act as the NAS server. Mount the same EFS file system to the AWS based web servers running on EC2 instances to serve the content
- **[SPM - 1] Q24**: The engineering team at a social media company is building an ElasticSearch based index for all the existing files in S3. To build this index, it only needs to read the…<br>→ **Đúng:** Create an application that will use the S3 Select ScanRange parameter to get the first 250 bytes and store that information in ElasticSearch Create an application that will traverse the S3 bucket, issue a Byte Range Fetch for the first 250 bytes, and store…
- **[SPM - 1] Q25**: A data analytics company needs to set up a data lake on Amazon S3 for a financial services client. The data lake is split in raw and curated zones. For compliance…<br>→ **Đúng:** Setup a lifecycle policy to transition the raw zone data into Glacier Deep Archive after 1 day of object creation Use Glue ETL job to write the transformed data in the curated zone using a compressed file format
- **[SPM - 1] Q36**: A multi-national digital media company wants to exit out of the business of owning and maintaining its own IT infrastructure so it can redeploy resources toward…<br>→ **Đúng:** Transfer the on-premises data into multiple Snowball Edge Storage Optimized devices. Copy the Snowball Edge data into Amazon S3 and create a lifecycle policy to transition the data into AWS Glacier
- **[SPM - 1] Q40**: A leading medical imaging equipment and diagnostic imaging solutions provider uses AWS Cloud to run its healthcare data flows through more than 500,000 medical imaging…<br>→ **Đúng:** The research assistant does not need to pay any transfer charges for the image upload
- **[SPM - 1] Q43**: The engineering team at a healthcare company is working on the Disaster Recovery (DR) plans for its Redshift cluster deployed in the eu-west-1 Region. The existing…<br>→ **Đúng:** Create a snapshot copy grant in the destination Region for a KMS key in the destination Region. Configure Redshift cross-Region snapshots in the source Region
- **[SPM - 1] Q54**: A digital media company has hired you as an AWS Certified Solutions Architect Professional to optimize the architecture for its backup solution for applications running…<br>→ **Đúng:** Create a backup process to persist all the data to an S3 bucket A using S3 standard storage class in the Production Region. Set up cross-Region replication of this S3 bucket A to an S3 bucket B using S3 standard storage class in the DR Region and set up a…
- **[SPM - 1] Q55**: A global apparel, footwear, and accessories retailer uses Amazon S3 for centralized storage of the static media assets such as images and videos for its products. The…<br>→ **Đúng:** Use Amazon CloudFront distribution with origin as the S3 bucket. This would speed up uploads as well as downloads for the video files Enable Amazon S3 Transfer Acceleration for the S3 bucket. This would speed up uploads as well as downloads for the video files
- **[SPM - 1] Q75**: A stock trading firm uses AWS Cloud for its IT infrastructure. The firm runs several trading-risk simulation applications, developing complex algorithms to simulate…<br>→ **Đúng:** Use S3 Glacier vault to store the sensitive archived data and then use a vault lock policy to enforce compliance controls
- **[SPM - 2] Q19**: An e-commerce company has created a data warehouse using Redshift that is used to analyze data from Amazon S3. From the usage patterns, the analytics team has detected…<br>→ **Đúng:** Analyze the cold data with Athena Transition the data to S3 Standard IA after 30 days
- **[SPM - 2] Q26**: A company uses Amazon S3 storage service for storing its business data. Multiple S3 event notifications have been configured to be delivered to Amazon Simple Queue…<br>→ **Đúng:** Create a customer-managed AWS KMS key and configure the key policy to grant permissions to the Amazon S3 service principal
- **[SPM - 2] Q44**: A medical insurance company stores its bills and supporting documents of its customers in an Amazon S3 bucket as per the regulatory guidelines. The bucket is organized…<br>→ **Đúng:** Create a new Amazon S3 bucket to be used for replication. Create a new S3 Replication Time Control (S3 RTC) rule on the source S3 bucket that filters data based on the prefix (high-value claim type) and replicates it to the new S3 bucket. Leverage an Amazon…
- **[SPM - 2] Q55**: An analytics company has configured a hybrid environment between its on-premises data center and the AWS Cloud. The company wants to use the Elastic File System (EFS) to…<br>→ **Đúng:** Configure a Route 53 Resolver inbound endpoint and configure it for the EFS specific VPC. Create a Route 53 private hosted zone and add a new CNAME record with the value of the EFS DNS name. Configure forwarding rules on the on-premises DNS servers to forward…
- **[SPM - 2] Q63**: A research agency processes multiple compressed (gzip) CSV files containing data about contagious diseases for the past month aggregated from healthcare facilities. The…<br>→ **Đúng:** Ingest the data into Amazon S3 from S3 Glacier and query the required data with Amazon S3 Select
- **[SPM - 3] Q6**: A company uses Amazon FSx for Windows File Server with deployment type of Single-AZ 2 as its file storage service for its non-core functions. With a change in the…<br>→ **Đúng:** You can monitor storage capacity and file system activity using Amazon CloudWatch, and monitor end-user actions with file access auditing using Amazon CloudWatch Logs and Amazon Kinesis Data Firehose Configure a new Amazon FSx for Windows file system with a…

</details>

<details>
<summary><b>3.6 Databases (RDS/Aurora/DynamoDB/Cache/Redshift)</b>: 29 câu</summary>

- ⚠️ **[Internet - 6] Q38**: A company wants to migrate an Amazon Aurora MySQL DB cluster from an existing AWS account to a new AWS account in the same AWS Region. Both accounts are members of the…<br>→ **Đúng:** Take a snapshot of the existing Aurora database. Share the snapshot with the new AWS account. Create an Aurora DB cluster in the new account from the snapshot. Create an Aurora DB cluster in the new AWS account. Use AWS Database Migration Service (AWS DMS) to…
- ⚠️ **[Internet - 6] Q74**: A company is running a serverless application that consists of several AWS Lambda functions and Amazon DynamoDB tables. The company has created new functionality that…<br>→ **Đúng:** Create three private subnets in the Neptune VPC, and route internet traffic through a NAT gateway. Host the Lambda functions in the three new private subnets. Create three private subnets in the Neptune VPC. Host the Lambda functions in the three new isolated…
- **[Internet - 1] Q16**: A company recently deployed an application on AWS. The application uses Amazon DynamoDB. The company measured the application load and configured the RCUs and WCUs on…<br>→ **Đúng:** Use AWS Application Auto Scaling to increase capacity during the peak period. Purchase reserved RCUs and WCUs to match the average load.
- **[Internet - 1] Q23**: A solutions architect has developed a web application that uses an Amazon API Gateway Regional endpoint and an AWS Lambda function. The consumers of the web application…<br>→ **Đúng:** Use RDS Proxy to set up a connection pool to the reader endpoint of the Aurora database. Move the code for opening the database connection in the Lambda function outside of the event handler.
- **[Internet - 1] Q42**: A company has applications in an AWS account that is named Source. The account is in an organization in AWS Organizations. One of the applications uses AWS Lambda…<br>→ **Đúng:** Download the Lambda function deployment package from the Source account. Use the deployment package and create new Lambda functions in the Target account. Share the Aurora DB cluster with the Target account by using AWS Resource Access Manager {AWS RAM).…
- **[Internet - 1] Q50**: A solutions architect is designing the data storage and retrieval architecture for a new application that a company will be launching soon. The application is designed…<br>→ **Đúng:** Design the application to store each incoming record in an Amazon DynamoDB table properly configured for the scale. Configure the DynamoDB Time to Live (TTL) feature to delete records older than 120 days.
- **[Internet - 2] Q36**: A company has an on-premises website application that provides real estate information for potential renters and buyers. The website uses a Java backend and a NoSQL…<br>→ **Đúng:** Configure Amazon DocumentDB (with MongoDB compatibility) with appropriately sized instances in multiple Availability Zones as the database for the subscriber data. Deploy Amazon EC2 instances in an Auto Scaling group across multiple Availability Zones for the…
- **[Internet - 2] Q55**: A company runs an IoT platform on AWS. IoT sensors in various locations send data to the company’s Node.js API servers on Amazon EC2 instances running behind an…<br>→ **Đúng:** Leverage Amazon Kinesis Data Streams and AWS Lambda to ingest and process the raw data. Re-architect the database tier to use Amazon DynamoDB instead of an RDS MySQL DB instance.
- **[Internet - 4] Q33**: A company operates quick-service restaurants. The restaurants follow a predictable model with high sales traffic for 4 hours daily. Sales traffic is lower outside of…<br>→ **Đúng:** Enable Dynamo DB auto scaling for the table.
- **[Internet - 4] Q53**: A solutions architect is planning to migrate critical Microsoft SQL Server databases to AWS. Because the databases are legacy systems, the solutions architect will move…<br>→ **Đúng:** Use native database high availability tools. Connect the source system to an Amazon RDS for Microsoft SQL Server DB instance. Configure replication accordingly. When data replication is finished, transition the workload to an Amazon RDS for Microsoft SQL…
- **[Internet - 5] Q1**: A company wants to migrate its on-premises application to AWS. The database for the application stores structured product data and temporary user session data. The…<br>→ **Đúng:** Create an Amazon RDS DB instance to host the product data. Configure a read replica for the DB instance in another Region. Create an Amazon DynamoDB global table to host the user session data.
- **[Internet - 6] Q2**: A company has deployed an Amazon Connect contact center. Contact center agents are reporting large numbers of computer-generated calls. The company is concerned about…<br>→ **Đúng:** Customize the Contact Control Panel (CCP) by adding a flag call button that will invoke an AWS Lambda function that calls the UpdateContactAttributes API. Use an Amazon DynamoDB table to store the spam numbers. Modify the contact flows to look for the updated…
- ✅ **[Internet - 6] Q12**: A company has an application that uses an Amazon Aurora PostgreSQL DB cluster for the application's database. The DB cluster contains one small primary instance and…<br>→ **Đúng:** Use Amazon RDS Proxy to create a proxy for the DB cluster. Configure a read-only endpoint for the proxy. Update the Lambda function to connect to the proxy endpoint.
- ✅ **[Internet - 6] Q36**: A company runs an application in the cloud that consists of a database and a website. Users can post data to the website, have the data processed, and have the data sent…<br>→ **Đúng:** Place the Tomcat server in an Auto Scaling group with multiple EC2 instances behind an Application Load Balancer. Migrate the MySQL database to Amazon Aurora with one Aurora Replica. Create an additional public subnet in a different Availability Zone in the…
- **[JBS - 3] Q13**: A company is hosting its three-tier web application on the us-east-1 region of AWS. The web and application tiers are stateless and both are running on their own fleet…<br>→ **Đúng:** Schedule a daily snapshot of the Amazon EC2 instances for the web and application tier. Copy the snapshot to the backup region. Restore the backups in case of a disaster in the primary region. Set up a cross-Region read replica of the Amazon Aurora database…
- **[JBS - 3] Q29**: A company has a CRM application that uses a MySQL database hosted in Amazon RDS, and a central data warehouse that runs on Amazon Redshift. There is a batch analytics…<br>→ **Đúng:** Add read replicas for the RDS database to speed up batch analytics and use Amazon SNS to notify the on-premises system to update the dashboard.
- **[JBS - 3] Q62**: A business news portal is visited by thousands of readers each day to check on the latest hot topics in the world of business and technology. The news portal runs on a…<br>→ **Đúng:** Add an in-memory datastore using Amazon ElastiCache for Redis to reduce the burden on the database. Enable Redis replication to scale database reads and to have highly available clusters.
- **[JBS - 4] Q11**: A large media company based in Los Angeles, California, operates a MySQL RDS instance within an AWS VPC. The company has a custom analytics application running in its…<br>→ **Đúng:** Create an IPSec VPN connection using either OpenVPN or VPN/VGW through the Virtual Private Cloud service. Prepare an instance of MySQL running external to Amazon RDS. Configure the MySQL RDS instance to be the replication source. Use mysqldump to transfer the…
- **[JBS - 4] Q43**: A legal consulting firm is running a WordPress website on EC2 instances deployed across multiple Availability Zones with a Multi-AZ RDS MySQL database instance. Their…<br>→ **Đúng:** Add an RDS MySQL Read Replica in each Availability Zone. Deploy an Amazon ElastiCache Cluster with nodes running in each Availability Zone. Implement sharding to distribute the incoming load to multiple RDS MySQL instances.
- **[JBS - 4] Q48**: A leading electronics company is getting ready to do a major public announcement of its latest smartphone. Their official website uses an Application Load Balancer in…<br>→ **Đúng:** Add Read Replicas in RDS for each Availability Zone. Implement a caching system using ElastiCache in-memory cache on each Availability Zone.
- **[JBS - 4] Q62**: A stock trading company is running its application on the AWS cloud. The mission-critical database is hosted on an Amazon RDS for MySQL instance deployed in a Multi-AZ…<br>→ **Đúng:** Migrate the Amazon RDS for MySQL cluster to an Amazon Aurora for MySQL cluster. Set up an Amazon RDS Proxy in front of the database layer to automatically route traffic to healthy RDS instances. Ensure that Multi-AZ is enabled on Amazon Aurora and create one…
- **[SPM - 1] Q28**: A company allows property owners and travelers to connect with each other for the purpose of renting unique vacation spaces around the world. The engineering team at the…<br>→ **Đúng:** Multi-AZ follows synchronous replication and spans at least two Availability Zones within a single region. Read Replicas follow asynchronous replication and can be within an Availability Zone, Cross-AZ, or Cross-Region
- **[SPM - 1] Q49**: The engineering team at a company is evaluating the Multi-AZ and Read Replica capabilities of RDS MySQL vs Aurora MySQL before they implement the solution in their…<br>→ **Đúng:** Read Replicas can be manually promoted to a standalone database instance for RDS MySQL whereas Read Replicas for Aurora MySQL can be promoted to the primary instance Multi-AZ deployments for both RDS MySQL and Aurora MySQL follow synchronous replication The…
- **[SPM - 2] Q4**: A solutions architect has configured an Amazon Relational Database Service (Amazon RDS) DB instance as part of an AWS Elastic Beanstalk environment. To resolve an issue,…<br>→ **Đúng:** Decouple the RDS DB instance from the Beanstalk environment (environment A) and leverage Elastic Beanstalk blue (environment A)/green (environment B) deployment to connect to the decoupled database post the upgrade
- **[SPM - 2] Q8**: A social gaming company is developing a mobile game that streams score updates to a backend processor and then publishes results on a leaderboard. The company has hired…<br>→ **Đúng:** Send score updates to Kinesis Data Streams which uses a Lambda function to process these updates and then store these processed updates in DynamoDB
- **[SPM - 2] Q42**: A company runs a mobile app-based health tracking solution. The mobile app sends 2 KB of data to the company’s backend servers every 2 minutes. The user data is stored…<br>→ **Đúng:** Set up an Amazon SQS queue to buffer writes to the Amazon DynamoDB table and reduce provisioned write throughput Set up a new DynamoDB table each day and drop the table for the previous day after its data is written on S3
- **[SPM - 2] Q57**: A company has decided to move their existing data warehouse solution to Amazon Redshift. Being apprehensive about moving their critical data directly, the company has…<br>→ **Đúng:** Add subnet CIDR range, or IP address of the replication instance in the inbound rules of the Amazon Redshift cluster security group Your Amazon Redshift cluster must be in the same account and same AWS Region as the replication instance
- **[SPM - 3] Q7**: A company manages a stateful web application that persists data on a MySQL database. The application stack is hosted in the company's on-premises data center using a…<br>→ **Đúng:** Set up database migration to Amazon Aurora MySQL. Deploy the application in an Auto Scaling group for Amazon EC2 instances that are fronted by an Application Load Balancer. Store sessions in an Amazon ElastiCache for Redis with replication group
- **[SPM - 3] Q28**: A leading pharmaceutical company has significant investments in running Oracle and PostgreSQL services on Amazon RDS which provide their scientists with near real-time…<br>→ **Đúng:** Use AWS Database Migration Service to replicate the data from the databases into Amazon Redshift

</details>

<details>
<summary><b>3.7 Analytics, Streaming & IoT</b>: 16 câu</summary>

- ⚠️ **[Internet - 6] Q3**: A company has mounted sensors to collect information about environmental parameters such as humidity and light throughout all the company's factories. The company needs…<br>→ **Đúng:** Stream the data to an Amazon Kinesis data stream. Create an AWS Lambda function to consume the Kinesis data stream and to analyze the data. Use Amazon Simple Notification Service (Amazon SNS) to notify the operations team.
- ⚠️ **[Internet - 6] Q42**: A flood monitoring agency has deployed more than 10,000 water-level monitoring sensors. Sensors send continuous data updates, and each update is less than 1 MB in size.…<br>→ **Đúng:** Send the sensor data to Amazon Kinesis Data Firehose. Use an AWS Lambda function to read the Kinesis Data Firehose data, convert it to Apache Parquet format, and save it to an Amazon S3 bucket. Instruct the data analysts to query the data by using Amazon…
- **[Internet - 2] Q14**: A company has an on-premises monitoring solution using a PostgreSQL database for persistence of events. The database is unable to scale due to heavy ingestion and it…<br>→ **Đúng:** Use Amazon Kinesis Data Firehose to buffer events. Create an AWS Lambda function to process and transform events. Configure Amazon Elasticsearch Service (Amazon ES) to receive events. Use the Kibana endpoint deployed with Amazon ES to create near-real-time…
- **[Internet - 3] Q3**: A company runs an application on AWS. The company curates data from several different sources. The company uses proprietary algorithms to perform data transformations…<br>→ **Đúng:** In the AWS account of the company that produces the data, create an AWS Data Exchange datashare by connecting AWS Data Exchange to the Redshift cluster. Configure subscription verification. Require the data customers to subscribe to the data product.
- **[Internet - 3] Q34**: A company runs an IoT application in the AWS Cloud. The company has millions of sensors that collect data from houses in the United States. The sensors use the MQTT…<br>→ **Đúng:** Set up AWS IoT Core to receive the sensor data. Create and configure a custom domain to connect to AWS IoT Core. Update the DNS record in Route 53 to point to the AWS IoT Core Data-ATS endpoint. Configure an AWS IoT rule to store the data.
- **[Internet - 3] Q41**: A company uses a load balancer to distribute traffic to Amazon EC2 instances in a single Availability Zone. The company is concerned about security and wants a solutions…<br>→ **Đúng:** Configure a Multi-AZ Auto Scaling group using the application's AMI. Create an Application Load Balancer (ALB) and select the previously created Auto Scaling group as the target. Create an Amazon Kinesis Data Firehose with a destination of the third-party…
- **[Internet - 3] Q44**: A company has IoT sensors that monitor traffic patterns throughout a large city. The company wants to read and collect data from the sensors and perform aggregations on…<br>→ **Đúng:** Reshard the stream to increase the number of shards in the stream. Use consumers with the enhanced fan-out feature. Use an error retry and exponential backoff mechanism in the consumer logic.
- **[Internet - 4] Q30**: A company is collecting a large amount of data from a fleet of IoT devices. Data is stored as Optimized Row Columnar (ORC) files in the Hadoop Distributed File System…<br>→ **Đúng:** Store data in Amazon S3. Use the AWS Glue Data Catalog and Amazon Athena to query data.
- **[Internet - 4] Q61**: A company has more than 10,000 sensors that send data to an on-premises Apache Kafka server by using the Message Queuing Telemetry Transport (MQTT) protocol. The…<br>→ **Đúng:** Deploy AWS IoT Core, and connect it to an Amazon Kinesis Data Firehose delivery stream. Use an AWS Lambda function to handle data transformation. Route the sensors to send the data to AWS IoT Core.
- **[Internet - 5] Q34**: A financial services company has an asset management product that thousands of customers use around the world. The customers provide feedback about the product through…<br>→ **Đúng:** Use AWS Service Catalog to control the Amazon EMR versions available for deployment, the cluster configuration, and the permissions for each user persona.
- **[JBS - 3] Q3**: A company is developing an application that will allow biologists from around the world to submit plant genomic information and share it with other biologists. The…<br>→ **Đúng:** Create a stream in Amazon Kinesis Data Streams to collect the inbound data. Use a Kinesis client to analyze the genomic data. After processing, use Amazon EMR to save the results to an Amazon Redshift cluster.
- **[SPM - 1] Q21**: A big data analytics company is leveraging AWS Cloud to process Internet of Things (IoT) sensor data from the field devices of an agricultural sciences company. The…<br>→ **Đúng:** Set up DynamoDB Streams to capture and send updates to a Lambda function that outputs records to Kinesis Data Analytics (KDA) via Kinesis Data Streams (KDS). Detect and analyze anomalies in KDA and send notifications via SNS
- **[SPM - 1] Q33**: A data analytics company stores event data in its on-premises PostgreSQL database. With the increase in the number of clients, the company is spending a lot of resources…<br>→ **Đúng:** Set up Amazon Kinesis Data Firehose to buffer events and an AWS Lambda function to process and transform the events. Set up Amazon OpenSearch to receive the transformed events. Use the Kibana endpoint that is deployed with OpenSearch to create near-real-time…
- **[SPM - 2] Q35**: A data analytics company leverages Amazon QuickSight (Enterprise Edition) for creating and publishing interactive BI dashboards that can be accessed from any device. For…<br>→ **Đúng:** Create a new private subnet in the same VPC as the Amazon RDS DB instance. Create a new security group with necessary inbound rules for QuickSight in the same VPC. Sign in to QuickSight as a QuickSight admin and create a new QuickSight VPC connection. Create…
- **[SPM - 2] Q39**: A data analytics company runs a real-time data processing application that uses Kinesis Client Library (KCL) to help consume and process data from the real-time data…<br>→ **Đúng:** Each KCL application must use its own DynamoDB table You can only use DynamoDB for checkpointing KCL
- **[SPM - 3] Q21**: A data analytics company uses Amazon S3 as the data lake to store the input data that is ingested from the IoT field devices on an hourly basis. The ingested data has…<br>→ **Đúng:** Store the data in Apache ORC, partitioned by date and sorted by device type of the device

</details>

<details>
<summary><b>3.8 Serverless, Containers & Integration</b>: 38 câu</summary>

- ⚠️ **[Internet - 6] Q66**: A car rental company has built a serverless REST API to provide data to its mobile app. The app consists of an Amazon API Gateway API with a Regional endpoint, AWS…<br>→ **Đúng:** Convert the API Gateway Regional endpoint to an edge-optimized endpoint. Enable caching in the production stage.
- **[Internet - 1] Q2**: A company is storing data in several Amazon DynamoDB tables. A solutions architect must use a serverless architecture to make the data accessible publicly through a…<br>→ **Đúng:** Create an Amazon API Gateway REST API. Configure this API with direct integrations to DynamoDB by using API Gateway’s AWS integration type. Create an Amazon API Gateway HTTP API. Configure this API with integrations to AWS Lambda functions that return data…
- **[Internet - 1] Q20**: A company hosts a Git repository in an on-premises data center. The company uses webhooks to invoke functionality that runs in the AWS Cloud. The company hosts the…<br>→ **Đúng:** Create an Amazon API Gateway HTTP API. Implement each webhook logic in a separate AWS Lambda function. Update the Git servers to call the API Gateway endpoint.
- **[Internet - 1] Q35**: A company built an application based on AWS Lambda deployed in an AWS CloudFormation stack. The last production release of the web application introduced an issue that…<br>→ **Đúng:** Create an alias for every new deployed version of the Lambda function. Use the AWS CLI update-alias command with the routing-config parameter to distribute the load.
- **[Internet - 2] Q17**: A company is running an application in the AWS Cloud. The company's security team must approve the creation of all new IAM users. When a new IAM user is created, all…<br>→ **Đúng:** Create an Amazon EventBridge (Amazon CloudWatch Events) rule. Define a pattern with the detail-type value set to AWS API Call via CloudTrail and an eventName of CreateUser. Invoke an AWS Step Functions state machine to remove access. Use Amazon Simple…
- **[Internet - 2] Q20**: A company is building a software-as-a-service (SaaS) solution on AWS. The company has deployed an Amazon API Gateway REST API with AWS Lambda integration in multiple AWS…<br>→ **Đúng:** The company reached its API Gateway account limit for calls per second.
- **[Internet - 2] Q34**: A company runs a proprietary stateless ETL application on an Amazon EC2 Linux instances. The application is a Linux binary, and the source code cannot be modified. The…<br>→ **Đúng:** Use AWS Fargate to run the application. Use Amazon EventBridge (Amazon CloudWatch Events) to invoke the Fargate task every 4 hours.
- **[Internet - 2] Q41**: A company is processing videos in the AWS Cloud by Using Amazon EC2 instances in an Auto Scaling group. It takes 30 minutes to process a video Several EC2 instances…<br>→ **Đúng:** Configure scale-in protection for the instances during processing
- **[Internet - 2] Q44**: A solutions architect is investigating an issue in which a company cannot establish new sessions in Amazon Workspaces. An initial analysis indicates that the issue…<br>→ **Đúng:** Increase capacity by using the update-file-system command. Implement an Amazon CloudWatch metric that monitors free space. Use Amazon EventBridge to invoke an AWS Lambda function to increase capacity as required.
- **[Internet - 2] Q45**: An international delivery company hosts a delivery management system on AWS. Drivers use the system to upload confirmation of delivery. Confirmation includes the…<br>→ **Đúng:** Use AWS Transfer Family to create an FTP server that places the files in Amazon S3. Use an S3 event notification through Amazon Simple Notification Service (Amazon SNS) to invoke an AWS Lambda function. Configure the Lambda function to add the metadata and…
- **[Internet - 3] Q5**: A company runs a processing engine in the AWS Cloud. The engine processes environmental data from logistics centers to calculate a sustainability index. The company has…<br>→ **Đúng:** Create an Amazon API Gateway HTTP API that implements the RESTful API. Create an Amazon Simple Queue Service (Amazon SQS) queue. Create an API Gateway service integration with the SQS queue. Create an AWS Lambda function to process messages in the SQS queue.
- **[Internet - 3] Q47**: A company is developing a new on-demand video application that is based on microservices. The application will have 5 million users at launch and will have 30 million…<br>→ **Đúng:** Configure the ECS services to use the blue/green deployment type and an Application Load Balancer. Implement Service Auto Scaling for each ECS service.
- **[Internet - 3] Q73**: A company needs to audit the security posture of a newly acquired AWS account. The company’s data security team requires a notification only when an Amazon S3 bucket…<br>→ **Đúng:** Create an analyzer in AWS Identity and Access Management Access Analyzer. Create an Amazon EventBridge rule for the event type “Access Analyzer Finding” with a filter for “isPublic: true.” Select the SNS topic as the EventBridge rule target.
- **[Internet - 4] Q11**: A company wants to manage the costs associated with a group of 20 applications that are infrequently used, but are still business-critical, by migrating to AWS. The…<br>→ **Đúng:** Deploy Amazon ECS containers on Amazon EC2 with Auto Scaling configured for memory utilization of 75%. Deploy an ECS task for each application being migrated with ECS task scaling. Monitor services and hosts by using Amazon CloudWatch.
- **[Internet - 4] Q50**: A company is building an application that will run on an AWS Lambda function. Hundreds of customers will use the application. The company wants to give each customer a…<br>→ **Đúng:** Create an Amazon API Gateway REST API with a proxy integration to invoke the Lambda function. For each customer, configure an API Gateway usage plan that includes an appropriate request quota. Create an API key from the usage plan for each user that the…
- **[Internet - 6] Q4**: A company is preparing to deploy an Amazon Elastic Kubernetes Service (Amazon EKS) cluster for a workload. The company expects the cluster to support an unpredictable…<br>→ **Đúng:** Configure the workload to use topology spread constraints that are based on Availability Zone.
- **[Internet - 7] Q2**: A company is deploying a new application on AWS. The application consists of an Amazon Elastic Kubernetes Service (Amazon EKS) cluster and an Amazon Elastic Container…<br>→ **Đúng:** Activate Amazon Inspector to scan the EKS nodes and the ECR repository.
- **[Internet - 7] Q9**: A utility company wants to collect usage data every 5 minutes from its smart meters to facilitate time-of-use metering. When a meter sends data to AWS, the data is sent…<br>→ **Đúng:** Increase the write capacity units to the DynamoDB table. Stream the data into an Amazon Kinesis data stream from API Gateway and process the data in batches.
- **[Internet - 7] Q13**: A company is running a serverless ecommerce application on AWS. The application uses Amazon API Gateway to invoke AWS Lambda Java functions. The Lambda functions connect…<br>→ **Đúng:** Create an RDS Proxy endpoint for the database. Store database secrets in AWS Secrets Manager. Set up the required IAM permissions. Update the Lambda functions to connect to the RDS Proxy endpoint. Increase the provisioned concurrency for the Lambda functions.
- **[Internet - 7] Q35**: A company hosts a data-processing application on Amazon EC2 instances. The application polls an Amazon Elastic File System (Amazon EFS) file system for newly uploaded…<br>→ **Đúng:** Create an Amazon Elastic Container Service (Amazon ECS) cluster. Configure the processing to run as AWS Fargate tasks. Extract the container selection logic to run as an AWS Lambda function that starts the appropriate Fargate task. Migrate the storage of file…
- **[Internet - 7] Q41**: A company is using AWS to develop and manage its production web application. The application includes an Amazon API Gateway HTTP API that invokes an AWS Lambda function.…<br>→ **Đúng:** Integrate the company’s third-party identity provider with API Gateway. Configure an API Gateway Lambda authorizer to validate tokens from the identity provider. Require the Lambda authorizer on all API routes. Update the web application to get tokens from…
- **[Internet - 7] Q44**: A company has several AWS Lambda functions written in Python. The functions are deployed with the .zip package deployment type. The functions use a Lambda layer that…<br>→ **Đúng:** Activate Amazon Inspector. Start automated CVE scans. Activate Lambda standard scanning and Lambda code scanning in Amazon Inspector. Tag Lambda functions that do not need code scans. In the tag, include a key of InspectorCodeExclusion and a value of…
- **[Internet - 7] Q48**: A company migrated to AWS and uses AWS Business Support. The company wants to monitor the cost-effectiveness of Amazon EC2 instances across AWS accounts. The EC2…<br>→ **Đúng:** Create an Amazon EventBridge rule to detect low utilization of EC2 instances reported by AWS Trusted Advisor. Configure the rule to invoke an AWS Lambda function that filters the data by tags for department, business unit, and environment and stops…
- **[JBS - 3] Q54**: A company wants to improve the security of its cloud resources by ensuring that all running EC2 instances were launched from pre-approved AMIs only, which are set by the…<br>→ **Đúng:** Set up a scheduled Lambda function to search through the list of running EC2 instances within your VPC and determine if any of these are based on unauthorized AMIs. Afterward, publish a new message to an SNS topic to inform the Security team that this…
- **[JBS - 4] Q4**: A company has a large collection of user-submitted stock photos. An AWS Lambda function processes and extracts metadata from these photos to make a searchable catalog.…<br>→ **Đúng:** Split the single Lambda function that processes the photos into several functions dedicated for each type of metadata. Create a workflow on AWS Step Functions that will run multiple Lambda functions in parallel. Create another workflow that will retrieve the…
- **[JBS - 4] Q8**: A media company recently launched a web service that allows users to upload and share short videos. Currently, the web servers are hosted on an Auto Scaling group of…<br>→ **Đúng:** Create an Amazon ECS Fargate cluster and use containers to host the web application. Create an Auto Scaling group of Amazon EC2 Spot instances to process the SQS queue. Use Amazon Rekognition to analyze and categorize the videos instead of the third-party…
- **[JBS - 4] Q19**: A company requires regular processing of a massive amount of product catalogs that need to be handled per batch. The data needs to be processed regularly by on-demand…<br>→ **Đúng:** Implement Step Functions to orchestrate batch processing workflows. Use the AWS Management Console to monitor workflow status and manage failure reprocessing.
- **[JBS - 4] Q29**: A big fast-food chain in Asia is planning to implement a location-based alert on their existing mobile app. If a user is in proximity to one of its restaurants, an alert…<br>→ **Đúng:** The mobile app will send device location to an SQS endpoint. Set up an API that utilizes an Application Load Balancer and an Auto Scaling group of EC2 instances, which will retrieve the relevant offers from DynamoDB. Use Amazon SNS to send offers to the…
- **[JBS - 4] Q53**: A digital banking company runs its production workload on the AWS cloud. The company has enabled multi-region support on an AWS CloudTrail trail. As part of the company…<br>→ **Đúng:** Create a rule in Amazon EventBridge that will check for patterns in AWS CloudTrail API calls with the CreateUser eventName. Send a message to an Amazon Simple Notification Service (Amazon SNS) topic. Have the security team subscribe to the SNS topic. Use…
- **[SPM - 1] Q2**: A retail company has hired you as an AWS Certified Solutions Architect Professional to provide consultancy for managing a serverless application that consists of…<br>→ **Đúng:** Process and analyze the AWS X-Ray traces and analyze HTTP methods to determine the root cause of the HTTP errors Process and analyze the Amazon CloudWatch Logs for Lambda function to determine processing times for requested images at pre-configured intervals
- **[SPM - 1] Q27**: A web development studio runs hundreds of Proof-of-Concept (PoC) and demo applications on virtual machines running on an on-premises server. Many of the applications are…<br>→ **Đúng:** Dockerize each application and then deploy to an ECS cluster running behind an Application Load Balancer
- **[SPM - 1] Q37**: The product team at a global IoT technology company is looking to build features to facilitate better collaboration with the company's customers. As part of its…<br>→ **Đúng:** API Gateway creates RESTful APIs that enable stateless client-server communication and API Gateway also creates WebSocket APIs that adhere to the WebSocket protocol, which enables stateful, full-duplex communication between client and server
- **[SPM - 1] Q39**: A leading hotel reviews website has a repository of more than one million high-quality digital images. When this massive volume of images became too cumbersome to handle…<br>→ **Đúng:** Use message timers to postpone the delivery of certain messages to the queue by one minute
- **[SPM - 1] Q44**: A leading club in the Major League Baseball runs a web platform that boasts over 50,000 pages and over 100 million digitized photographs. It is available in six…<br>→ **Đúng:** Amazon SNS message deliveries to AWS Lambda have crossed the account concurrency quota for Lambda, so the team needs to contact AWS support to raise the account limit
- **[SPM - 1] Q51**: A leading mobility company wants to use AWS for its connected cab application that would collect sensor data from its electric cab fleet to give drivers dynamically…<br>→ **Đúng:** Ingest the sensor data in an Amazon SQS standard queue, which is polled by a Lambda function in batches and the data is written into an auto-scaled DynamoDB table for downstream processing
- **[SPM - 1] Q64**: A healthcare technology solutions company recently faced a security event resulting in an S3 bucket with sensitive data containing Personally Identifiable Information…<br>→ **Đúng:** Configure a Lambda function as one of the SNS topic subscribers, which is invoked to secure the objects in the S3 bucket Enable object-level logging for S3. Set up a EventBridge event pattern when a PutObject API call with public-read permission is detected…
- **[SPM - 1] Q73**: An automobile company helps more than 20 million web and mobile users browse automobile dealer inventory, read vehicle reviews, and consume other automobile-related…<br>→ **Đúng:** If you intend to reuse code in more than one Lambda function, you should consider creating a Lambda Layer for the reusable code Since Lambda functions can scale extremely quickly, it's a good idea to deploy a CloudWatch Alarm that notifies your team when…
- **[SPM - 2] Q31**: A payment service provider company has a legacy application built on high throughput and resilient queueing system to send messages to the customers. The implementation…<br>→ **Đúng:** Design the serverless architecture by use of Amazon Simple Queue Service (SQS) with Amazon ECS Fargate. To save costs, run the Amazon SQS FIFO queues and Amazon ECS Fargate tasks only when needed

</details>

<details>
<summary><b>3.9 Migration & Transfer</b>: 20 câu</summary>

- **[Internet - 1] Q14**: A company wants to migrate its workloads from on premises to AWS. The workloads run on Linux and Windows. The company has a large on-premises infrastructure that…<br>→ **Đúng:** Assess the existing applications by installing AWS Application Discovery Agent on the physical machines and VMs. Group servers into applications for migration by using AWS Migration Hub. Generate recommended instance types and associated costs by using AWS…
- **[Internet - 1] Q36**: A finance company hosts a data lake in Amazon S3. The company receives financial data records over SFTP each night from several third parties. The company runs its own…<br>→ **Đúng:** Migrate the SFTP server to AWS Transfer for SFTP. Update the DNS record sftp.example.com in Route 53 to point to the server endpoint hostname.
- **[Internet - 1] Q37**: A company wants to migrate an application to Amazon EC2 from VMware Infrastructure that runs in an on-premises data center. A solutions architect must preserve the…<br>→ **Đúng:** Use the VMware vSphere client to export the application as an image in Open Virtualization Format (OVF) format. Create an Amazon S3 bucket to store the image in the destination AWS Region. Create and apply an IAM role for VM Import. Use the AWS CLI to run the…
- **[Internet - 2] Q48**: A company wants to use AWS to create a business continuity solution in case the company's main on-premises application fails. The application runs on physical servers…<br>→ **Đúng:** Install the AWS Replication Agent on the source servers, including the MySQL servers. Initialize AWS Elastic Disaster Recovery in the target AWS Region. Define the launch settings. Frequently perform failover and fallback from the most recent point in time.
- **[Internet - 3] Q28**: A company is planning a one-time migration of an on-premises MySQL database to Amazon Aurora MySQL in the us-east-1 Region. The company's current internet connection has…<br>→ **Đúng:** Order an AWS Snowball Edge device. Load the data into an Amazon S3 bucket by using the S3 interface. Use AWS Database Migration Service (AWS DMS) to migrate the data from Amazon S3 to Aurora MySQL.
- **[Internet - 3] Q58**: A solutions architect must create a business case for migration of a company's on-premises data center to the AWS Cloud. The solutions architect will use a configuration…<br>→ **Đúng:** Use Migration Evaluator to perform an analysis. Use the data import template to upload the data from the CMDB export.
- **[Internet - 4] Q29**: A company has a Windows-based desktop application that is packaged and deployed to the users' Windows machines. The company recently acquired another company that has…<br>→ **Đúng:** Use an Amazon AppStream 2.0 image builder to create an image that includes the application and the required configurations. Provision an AppStream 2.0 On-Demand fleet with dynamic Fleet Auto Scaling policies for running the image. Implement authentication by…
- **[Internet - 4] Q41**: A company needs to migrate an on-premises SFTP site to AWS. The SFTP site currently runs on a Linux VM. Uploaded files are made available to downstream applications…<br>→ **Đúng:** Create an AWS Transfer Family server. Configure an internet-facing VPC endpoint for the Transfer Family server. Specify an Elastic IP address for each subnet. Configure the Transfer Family server to place files into an Amazon Elastic File System (Amazon EFS)…
- **[Internet - 4] Q49**: A company is planning to migrate several applications to AWS. The company does not have a good understanding of its entire application estate. The estate consists of a…<br>→ **Đúng:** Use AWS Migration Hub and select the servers that host the application. Visualize the network graph to find servers that interact with the application. Turn on data exploration in Amazon Athena. Query the data that is transferred between the servers to…
- **[Internet - 5] Q13**: A company is migrating a legacy application from an on-premises data center to AWS. The application consists of a single application server and a Microsoft SQL Server…<br>→ **Đúng:** Use an AWS Server Migration Service (AWS SMS) replication job to migrate the application server VM to AWS. Use an AWS Database Migration Service (AWS DMS) replication instance to migrate the database to an Amazon RDS DB instance.
- **[Internet - 5] Q33**: A company maintains information on premises in approximately 1 million.csv files that are hosted on a VM. The data initially is 10 TB in size and grows at a rate of 1 TB…<br>→ **Đúng:** Install the AWS DataSync agent as a VM that runs on the on-premises hypervisor. Configure a DataSync task to replicate the data to Amazon S3 daily.
- **[Internet - 7] Q11**: A company plans to migrate many VMs from an on-premises environment to AWS. The company requires an initial assessment of the on-premises environment before the…<br>→ **Đúng:** Install the AWS Application Discovery Agent on each on-premises VM. After the data collection period ends, use AWS Migration Hub to view the application dependencies. Download the Quick insights assessment report from Migration Hub.
- **[Internet - 7] Q26**: A company needs to migrate its on-premises database fleet to Amazon RDS. The company is currently using a mixture of Microsoft SQL Server, MySQL, and Oracle databases.…<br>→ **Đúng:** Use the AWS Schema Conversion Tool (AWS SCT) to analyze the source databases for changes that are required Use AWS Database Migration Service (AWS DMS) to migrate the source databases to Amazon RDS.
- **[Internet - 7] Q39**: A company is migrating its data center to the AWS Cloud and needs to complete the migration as quickly as possible. The company has many applications that are running on…<br>→ **Đúng:** Deploy the AWS Application Migration Service agentless appliance to VMware vCenter. Copy the Windows file share data to a new Amazon FSx for Windows File Server file system. After migration, remap the file share on each VM to the FSx for Windows File Server…
- **[Internet - 7] Q65**: A company wants to migrate virtual Microsoft workloads from an on-premises data center to AWS. The company has successfully tested a few sample workloads on AWS. The…<br>→ **Đúng:** Launch a Windows Amazon EC2 instance. Install the Migration Evaluator agentless collector on the EC2 instance. Configure Migration Evaluator to generate the TCO report.
- **[JBS - 4] Q6**: A company has a suite of IBM products in its on-premises data centers, such as IBM WebSphere, IBM MQ, and IBM DB2 servers. The solutions architect has been tasked to…<br>→ **Đúng:** Use the AWS Database Migration Service (DMS) and the AWS Schema Conversion Tool (SCT) to convert, migrate, and re-architect the IBM Db2 database to Amazon Aurora. Set up an Auto Scaling group of EC2 instances with an ELB in front to migrate and re-host your…
- **[JBS - 4] Q56**: A retail company runs its customer support call system on its in-house data center. The Solutions Architect was tasked to migrate the call system to AWS and leverage the…<br>→ **Đúng:** Use an Amazon Lex bot to recognize callers' intent. Use the Amazon Connect service to create an omnichannel cloud-based contact center for the agents.
- **[JBS - 4] Q67**: A multinational consumer goods company is currently using a VMWare vCenter Server to manage their virtual machines, multiple ESXi hosts, and all dependent components…<br>→ **Đúng:** Use the AWS Application Migration Service to migrate your on-premises workloads to the AWS cloud. Install the AWS Replication Agent in your on-premises virtualization environment.
- **[SPM - 1] Q8**: The DevOps team at a leading social media company uses Chef to automate the configurations of servers in the on-premises data center. The CTO at the company now wants to…<br>→ **Đúng:** Replatform the IT infrastructure to AWS Cloud by leveraging AWS OpsWorks as a configuration management service to automate the configurations of servers on AWS
- **[SPM - 1] Q12**: A company wants to migrate its on-premises Oracle database to Aurora MySQL. The company has hired an AWS Certified Solutions Architect Professional to carry out the…<br>→ **Đúng:** Configure DMS data validation on the migration task so it can compare the source and target data for the DMS task and report any mismatches

</details>

<details>
<summary><b>3.10 IaC, Deployment & Operations</b>: 22 câu</summary>

- **[Internet - 1] Q49**: A company is running several workloads in a single AWS account. A new company policy states that engineers can provision only approved resources and that engineers must…<br>→ **Đúng:** Update the IAM policy for the engineers’ IAM role with permissions to only allow AWS CloudFormation actions. Create a new IAM policy with permission to provision approved resources, and assign the policy to a new IAM service role. Assign the IAM service role…
- **[Internet - 1] Q63**: A company needs to implement a patching process for its servers. The on-premises servers and Amazon EC2 instances use a variety of tools to perform patching. Management…<br>→ **Đúng:** Use AWS Systems Manager to manage patches on the on-premises servers and EC2 instances. Use Systems Manager to generate patch compliance reports.
- **[Internet - 2] Q61**: A company plans to refactor a monolithic application into a modern application design deployed on AWS. The CI/CD pipeline needs to be upgraded to support the modern…<br>→ **Đúng:** Specify AWS Elastic Beanstalk to stage in a secondary environment as the deployment target for the CI/CD pipeline of the application. To deploy, swap the staging and production environment URLs.
- **[Internet - 2] Q64**: A company is using AWS CloudFormation to deploy its infrastructure. The company is concerned that, if a production CloudFormation stack is deleted, important data stored…<br>→ **Đúng:** Modify the CloudFormation templates to add a DeletionPolicy attribute to RDS and EBS resources.
- **[Internet - 3] Q38**: A company uses a Grafana data visualization solution that runs on a single Amazon EC2 instance to monitor the health of the company's AWS workloads. The company has…<br>→ **Đúng:** Create an Amazon Managed Grafana workspace. Configure a new Amazon CloudWatch data source. Export dashboards from the existing Grafana instance. Import the dashboards into the new workspace.
- **[Internet - 4] Q42**: A solutions architect has an operational workload deployed on Amazon EC2 instances in an Auto Scaling group. The VPC architecture spans two Availability Zones (AZ) with…<br>→ **Đúng:** Update the Auto Scaling group to use the AZ2 subnet only. Delete and re-create the AZ1 subnet using half the previous address space. Adjust the Auto Scaling group to also use the new AZ1 subnet. When the instances are healthy, adjust the Auto Scaling group to…
- **[Internet - 5] Q3**: A financial services company runs a complex, multi-tier application on Amazon EC2 instances and AWS Lambda functions. The application stores temporary data in Amazon S3.…<br>→ **Đúng:** Implement a Lambda function that deletes all files from a given S3 bucket. Integrate this Lambda function as a custom resource into the CloudFormation stack. Ensure that the custom resource has a DependsOn attribute that points to the S3 bucket's resource.
- **[Internet - 5] Q22**: A company has used infrastructure as code (IaC) to provision a set of two Amazon EC2 instances. The instances have remained the same for several years. The company's…<br>→ **Đúng:** Create an Elastic Load Balancer in front of the Auto Scaling group. Configure monitoring to ensure that target group health checks return healthy after the Auto Scaling group replaces the terminated instances. Create automation scripts to patch an AMI, update…
- **[Internet - 6] Q55**: A company built an ecommerce website on AWS using a three-tier web architecture. The application is Java-based and composed of an Amazon CloudFront distribution, an…<br>→ **Đúng:** Configure the Aurora MySQL DB cluster to publish slow query and error logs to Amazon CloudWatch Logs. Implement the AWS X-Ray SDK to trace incoming HTTP requests on the EC2 instances and implement tracing of SQL queries with the X-Ray SDK for Java. Install…
- **[Internet - 7] Q16**: A solutions architect is importing a VM from an on-premises environment by using the Amazon EC2 VM Import feature of AWS Import/Export. The solutions architect has…<br>→ **Đúng:** Verify that Systems Manager Agent is installed on the instance and is running. Verify that the instance is assigned an appropriate IAM role for Systems Manager.
- **[Internet - 7] Q49**: A company is hosting an application on AWS for a project that will run for the next 3 years. The application consists of 20 Amazon EC2 On-Demand Instances that are…<br>→ **Đúng:** Create an Auto Scaling group. Attach the Auto Scaling group to the target group of the NLB. Set the minimum capacity to 4 and the maximum capacity to 28. Purchase Reserved Instances for four instances.
- **[Internet - 7] Q57**: A company wants to record key performance indicators (KPIs) from its application as part of a strategy to convert to a user-based licensing schema. The application is a…<br>→ **Đúng:** Configure an Amazon CloudWatch Logs metric filter that saves each successful login as a metric. Configure the user name and client name as dimensions for the metric.
- **[JBS - 3] Q36**: A company uses an AWS CloudFormation template to deploy its three-tier web application on the AWS Cloud. The CloudFormation template contains a custom AMI value used by…<br>→ **Đúng:** Update the CloudFormation template AWS::AutoScaling::AutoScalingGroup resource section and specify an UpdatePolicy attribute with an AutoScalingRollingUpdate .
- **[JBS - 4] Q15**: A privately funded aerospace and sub-orbital spaceflight services company hosts its rapidly evolving applications in AWS. For its deployment process, the company is…<br>→ **Đúng:** Use CloudFormation with Systems Manager Parameter Store to retrieve the latest AMI IDs for your template. Whenever you decide to update the EC2 instances, call the update-stack API in CloudFormation in your CloudFormation template.
- **[JBS - 4] Q18**: A company has adopted cloud-native computing best practices for its infrastructure. The company started using AWS CloudFormation templates for defining its cloud…<br>→ **Đúng:** Create a pipeline in AWS CodePipeline that is triggered automatically for commits on the private GitHub repository. Have the pipeline create a change set and execute the CloudFormation template. Add an AWS CodeBuild stage on the pipeline to build and run test…
- **[JBS - 4] Q26**: A company plans to migrate its on-premises legacy application to AWS and develop a highly scalable application. Currently, all user requests are sent to the on-premises…<br>→ **Đúng:** Create an AWS Lambda function to update the database IP addresses on the Systems Manager Parameter Store. Create an Amazon EC2 bootstrap script that will retrieve the database IP address from SSM Parameter Store. Update the local configuration files with the…
- **[JBS - 4] Q66**: A company has several applications written in TypeScript and Python hosted on the AWS cloud. The company uses an automated deployment solution for its applications using…<br>→ **Đúng:** Write TypeScript or Python code that will define AWS resources. Convert these codes to AWS CloudFormation templates by using AWS Cloud Development Kit (AWS CDK). Create CloudFormation stacks using AWS CDK. Create an AWS CodeBuild job that includes AWS CDK and…
- **[SPM - 1] Q30**: The DevOps team for a CRM SaaS company wants to implement a patching plan on AWS Cloud for a large mixed fleet of Windows and Linux servers. The patching plan has to be…<br>→ **Đúng:** Set up Systems Manager Agent on all instances to manage patching. Test patches in pre-production and then deploy as a maintenance window task with the appropriate approval Apply patch baselines using the AWS-RunPatchBaseline SSM document
- **[SPM - 2] Q21**: For deployments across AWS accounts, a company has decided to use AWS CodePipeline to deploy an AWS CloudFormation stack in an AWS account (account A) to a different AWS…<br>→ **Đúng:** In account A, create a customer-managed AWS KMS key that grants usage permissions to account A's CodePipeline service role and account B. Also, create an Amazon Simple Storage Service (Amazon S3) bucket with a bucket policy that grants account B access to the…
- **[SPM - 2] Q37**: A web application is running on a fleet of Amazon EC2 instances that are configured to operate in an Auto Scaling group (ASG). The instances are fronted by an Elastic…<br>→ **Đúng:** Create a new ASG launch configuration that uses the newly created AMI. Double the size of the ASG and allow the new instances to become healthy and then reduce the ASG back to the original size. If the new instances do not work as expected, associate the ASG…
- **[SPM - 2] Q45**: A company has an Elastic Load Balancer (ELB) that is configured with an Auto Scaling Group (ASG) having a minimum of 4, a maximum of 10, and the desired value of 4…<br>→ **Đúng:** Configure connection draining on ELB
- **[SPM - 2] Q64**: A solutions architect at a company is managing the migration of the company's IT infrastructure from its on-premises data center to AWS Cloud. The architect needs to…<br>→ **Đúng:** Deploy the VPC infrastructure using AWS CloudFormation and leverage a custom resource to request a unique CIDR range from an external IP address management (IPAM) service

</details>

<details>
<summary><b>3.11 Cost Optimization & Billing</b>: 12 câu</summary>

- ⚠️ **[Internet - 6] Q15**: A software as a service (SaaS) company has developed a multi-tenant environment. The company uses Amazon DynamoDB tables that the tenants share for the storage layer.…<br>→ **Đúng:** Configure the Lambda functions to log the tenant ID and the number of RCUs and WCUs consumed from DynamoDB for each transaction to Amazon CloudWatch Logs. Deploy another Lambda function to calculate the tenant costs by using the logged capacity units and the…
- ⚠️ **[Internet - 6] Q46**: A company used AWS CloudFormation to create all new infrastructure in its AWS member accounts. The resources rarely change and are properly sized for the expected load.…<br>→ **Đúng:** Use AWS Cost Anomaly Detection to create a cost monitor that has a monitor type of AWS services. Create a subscription to send daily AWS cost summaries to the operations team. Specify a threshold for cost variance.
- **[Internet - 1] Q4**: A company that has multiple AWS accounts is using AWS Organizations. The company’s AWS accounts host VPCs, Amazon EC2 instances, and containers. The company’s compliance…<br>→ **Đúng:** In the management account of the organization, activate the costCenter user-defined tag. Configure monthly AWS Cost and Usage Reports to save to an Amazon S3 bucket in the management account. Use the tag breakdown in the report to obtain the total cost for…
- **[Internet - 1] Q30**: A company’s factory and automation applications are running in a single VPC. More than 20 applications run on a combination of Amazon EC2, Amazon Elastic Container…<br>→ **Đúng:** Activate the user-define cost allocation tags that represent the application and the team. Create a cost category for each application in Billing and Cost Management. Enable Cost Explorer.
- **[Internet - 2] Q8**: A retail company has structured its AWS accounts to be part of an organization in AWS Organizations. The company has set up consolidated billing and has mapped its…<br>→ **Đúng:** In the AWS Billing and Cost Management console. use the organization’s management account 10 turn off RI Sharing for the HR departments production AWS account.
- **[Internet - 2] Q13**: A company is developing and hosting several projects in the AWS Cloud. The projects are developed across multiple AWS accounts under the same organization in AWS…<br>→ **Đúng:** Create an AWS Config rule in each account to find resources with missing tags. Create an SCP in the organization with a deny action for ec2:RunInstances if the Project tag is missing. Create an AWS Config aggregator for the organization to collect a list of…
- **[Internet - 2] Q30**: A solutions architect must analyze a company’s Amazon EC2 instances and Amazon Elastic Block Store (Amazon EBS) volumes to determine whether the company is using…<br>→ **Đúng:** Install the Amazon CloudWatch agent on each of the EC2 instances. Turn on AWS Compute Optimizer, and let it run for at least 12 hours. Review the recommendations from Compute Optimizer, and rightsize the EC2 instances as directed.
- **[Internet - 4] Q12**: A solutions architect needs to review the design of an Amazon EMR cluster that is using the EMR File System (EMRFS). The cluster performs tasks that are critical to…<br>→ **Đúng:** Launch the primary and core nodes on On-Demand Instances. Launch the task nodes on Spot Instances in an instance fleet. Terminate the cluster, including all instances, when the processing is completed. Purchase Compute Savings Plans to cover the On-Demand…
- **[Internet - 5] Q10**: An online gaming company needs to optimize the cost of its workloads on AWS. The company uses a dedicated account to host the production environment for its online…<br>→ **Đúng:** Purchase an EC2 Instance Savings Plan for the online gaming application instances. Use Spot Instances for the analytics application.
- **[Internet - 5] Q41**: A large payroll company recently merged with a small staffing company. The unified company now has multiple business units, each with its own existing AWS account. A…<br>→ **Đúng:** Create the OrganizationAccountAccessRole IAM role in each member account. Grant permission to the management account to assume the IAM role.
- **[JBS - 4] Q59**: A pharmaceutical company has a hybrid cloud architecture in AWS. It has three different accounts for its environments: DEV, UAT, and PROD, which are all part of the…<br>→ **Đúng:** Currently, only the DEV account benefits from the Reserved Pricing.
- **[JBS - 4] Q65**: A computer hardware manufacturer has a supply chain application that is written in NodeJS. The application is deployed on an Amazon EC2 Reserved instance which has been…<br>→ **Đúng:** An IAM trust policy that allows the Amazon EC2 service to assume an EC2 instance role. An IAM permissions policy that allows the EC2 role to access S3 objects.

</details>

<details>
<summary><b>3.12 DR, HA & Backup</b>: 3 câu</summary>

- ⚠️ **[Internet - 6] Q47**: A company is deploying a new web-based application and needs a storage solution for the Linux application servers. The company wants to create a single location for…<br>→ **Đúng:** Deploy a new Amazon Elastic File System (Amazon EFS) Multi-AZ file system. Configure the file system for 75 MiBps of provisioned throughput. Implement replication to a file system in the DR Region.
- **[Internet - 1] Q74**: A company is developing a new service that will be accessed using TCP on a static port. A solutions architect must ensure that the service is highly available, has…<br>→ **Đúng:** Create Amazon EC2 instances for the service. Create one Elastic IP address for each Availability Zone. Create a Network Load Balancer (NLB) and expose the assigned TCP port. Assign the Elastic IP addresses to the NLB for each Availability Zone. Create a…
- **[Internet - 6] Q28**: A company has developed an application that is running Windows Server on VMware vSphere VMs that the company hosts on premises. The application data is stored in a…<br>→ **Đúng:** Configure AWS Elastic Disaster Recovery. Replicate the data to replication Amazon EC2 instances that are attached to Amazon Elastic Block Store (Amazon EBS) volumes. When the on-premises environment is unavailable, use Elastic Disaster Recovery to launch EC2…

</details>

<details>
<summary><b>Khác</b>: 1 câu</summary>

- **[JBS - 4] Q32**: A company launched a high-performance computing (HPC) application inside the VPC of its AWS account. The application is composed of hundreds of private EC2 instances…<br>→ **Đúng:** Stop the custom cluster controller instance and move it to the existing placement group.

</details>

