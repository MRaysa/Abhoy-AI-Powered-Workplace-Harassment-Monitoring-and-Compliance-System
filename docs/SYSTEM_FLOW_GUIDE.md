# SafeDesk Anonymous Complaint System - Complete Flow

## 🌐 User Journey Map

### 1️⃣ **Landing Page** (`http://localhost:5173/`)
```
┌─────────────────────────────────────────────────┐
│          🏠 SafeDesk Homepage                   │
├─────────────────────────────────────────────────┤
│                                                 │
│   Hero Section:                                 │
│   ┌──────────────────┐  ┌──────────────────┐  │
│   │ Submit Anonymous │  │ View Community   │  │
│   │     Report       │  │     Forum        │  │
│   │   (FileText 📄)  │  │   (Users 👥)     │  │
│   └──────────────────┘  └──────────────────┘  │
│                                                 │
│   Feature Cards:                                │
│   ┌────────────────────────────────────┐       │
│   │ Anonymous Complaint System         │       │
│   │ (Clickable → /submit-complaint)    │       │
│   └────────────────────────────────────┘       │
│   ┌────────────────────────────────────┐       │
│   │ Public Harassment Forum            │       │
│   │ (Clickable → /forum)               │       │
│   └────────────────────────────────────┘       │
│                                                 │
│   CTA Button:                                   │
│   ┌──────────────────┐                         │
│   │ Begin Your Report│                         │
│   │ → /submit-complaint                        │
│   └──────────────────┘                         │
└─────────────────────────────────────────────────┘
```

---

### 2️⃣ **Submit Anonymous Complaint** (`/submit-complaint`)
```
┌─────────────────────────────────────────────────┐
│     📝 Anonymous Complaint Submission           │
├─────────────────────────────────────────────────┤
│                                                 │
│  Step 1: Incident Details                      │
│  ├─ Title                                       │
│  ├─ Description                                 │
│  ├─ Type (Harassment, Discrimination, etc.)     │
│  └─ Priority (Critical, High, Medium, Low)      │
│                                                 │
│  Step 2: Evidence Upload                       │
│  ├─ Upload Files (Screenshots, Docs, etc.)     │
│  └─ Add URLs (Links to evidence)               │
│                                                 │
│  Step 3: Witness Verification                  │
│  └─ Collect 5+ Witnesses via Form Link         │
│                                                 │
│  Step 4: Incident Context                      │
│  ├─ Date & Time                                │
│  ├─ Location                                    │
│  ├─ Witnesses Present                          │
│  └─ Previous Reports                            │
│                                                 │
│  Step 5: Review & Submit                       │
│  └─ Receive Anonymous ID (ANON-2025-XXXXXXXX)  │
│                                                 │
│  📥 Result: Complaint saved to database         │
│              Status: PENDING                    │
└─────────────────────────────────────────────────┘
```

---

### 3️⃣ **Admin Panel Review** (`/admin/complaints`)
```
┌─────────────────────────────────────────────────┐
│      🛡️ Admin Complaint Management Panel       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Status Filter:                                 │
│  ┌────┐ ┌────────┐ ┌──────────┐ ┌──────────┐  │
│  │All │ │Pending │ │Under Rev.│ │Verified  │  │
│  └────┘ └────────┘ └──────────┘ └──────────┘  │
│                                                 │
│  Search: [Search by title or ID...]            │
│                                                 │
│  ┌─────────────────────────────────────────┐  │
│  │ Complaints Table                         │  │
│  ├──────┬───────┬──────┬────────┬────────┬─┤  │
│  │ ID   │Title  │Type  │Priority│Status  │⚙│  │
│  ├──────┼───────┼──────┼────────┼────────┼─┤  │
│  │ANON- │Sexual │Haras │Critical│Pending │✓│  │
│  │2025- │Haras. │sment │        │        │ │  │
│  │12345 │       │      │        │        │ │  │
│  └──────┴───────┴──────┴────────┴────────┴─┘  │
│                                                 │
│  Click "View" → Detail Modal:                  │
│  ┌───────────────────────────────────────┐    │
│  │ Complaint Details                     │    │
│  │ ├─ Basic Info                         │    │
│  │ ├─ Full Description                   │    │
│  │ ├─ Evidence Files/URLs                │    │
│  │ └─ Admin Actions:                     │    │
│  │    ┌─────────┐ ┌──────────┐          │    │
│  │    │ Verify  │ │  Reject  │          │    │
│  │    └─────────┘ └──────────┘          │    │
│  │    ┌──────────────────────┐          │    │
│  │    │ Approve for Forum    │          │    │
│  │    └──────────────────────┘          │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  Admin Actions:                                │
│  ✓ Update Status (Pending → Verified)         │
│  ✓ Approve for Public Forum                   │
│  ✓ Add Admin Notes                            │
└─────────────────────────────────────────────────┘
```

---

### 4️⃣ **Public Forum** (`/forum`)
```
┌─────────────────────────────────────────────────┐
│     👥 Public Harassment Forum                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Statistics Dashboard:                          │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │
│  │ 156    │ │ 1.2K   │ │ 892    │ │ 98%    │  │
│  │ Posts  │ │ Voices │ │Comments│ │Support │  │
│  └────────┘ └────────┘ └────────┘ └────────┘  │
│                                                 │
│  Search & Filter:                               │
│  [Search posts...] [All Types ▼] [Sort by ▼]  │
│                                                 │
│  ┌─────────────────────────────────────────┐  │
│  │ 📄 Post Card (Only Approved Complaints) │  │
│  ├─────────────────────────────────────────┤  │
│  │ ANON-2025-12345 • 2 days ago           │  │
│  │                                          │  │
│  │ Sexual Harassment in Workplace          │  │
│  │                                          │  │
│  │ I experienced inappropriate behavior... │  │
│  │                                          │  │
│  │ 🙏 Support: 45 | 😟 Concern: 12 | 👊 Me Too: 8│  │
│  │                                          │  │
│  │ 💬 8 Comments    [React] [Comment]      │  │
│  │                                          │  │
│  │ Evidence: 📎 3 files attached           │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
│  Community Features:                            │
│  ✓ Anonymous Reactions (Support/Concern/Me Too)│
│  ✓ Anonymous Comments                          │
│  ✓ Search & Filter Posts                       │
│  ✓ Category-based Browse                       │
│                                                 │
│  Note: Only admin-approved complaints shown    │
└─────────────────────────────────────────────────┘
```

---

### 5️⃣ **Track Complaint** (`/track-complaint`)
```
┌─────────────────────────────────────────────────┐
│     🔍 Track Your Complaint                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  Enter Your Anonymous ID:                      │
│  ┌──────────────────────────────────────────┐ │
│  │ ANON-2025-XXXXXXXX                       │ │
│  └──────────────────────────────────────────┘ │
│  [Track Complaint]                             │
│                                                 │
│  ┌─────────────────────────────────────────┐  │
│  │ Complaint Status Timeline                │  │
│  ├─────────────────────────────────────────┤  │
│  │ ✓ Submitted     - Jan 15, 2025 10:30 AM │  │
│  │ ✓ Under Review  - Jan 16, 2025 02:15 PM │  │
│  │ → Verified      - Jan 18, 2025 (Current) │  │
│  │ ○ Resolved      - Pending                │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
│  Details:                                       │
│  ├─ Title: Your Complaint Title                │
│  ├─ Status: Verified ✅                        │
│  ├─ Forum Status: Approved for Public View     │
│  ├─ Evidence: 3 files attached                 │
│  └─ Admin Notes: Reviewed and verified         │
│                                                 │
│  [Download Report PDF]                         │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Complete System Flow Diagram

```
┌──────────────┐
│   Homepage   │
│      🏠      │
└──────┬───────┘
       │
       ├──────────────────┬────────────────┐
       │                  │                │
       ▼                  ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│Submit Report │  │ View Forum   │  │Track Status  │
│     📝       │  │     👥       │  │     🔍       │
└──────┬───────┘  └──────┬───────┘  └──────────────┘
       │                  │
       │                  │
       ▼                  │
┌──────────────┐         │
│   Backend    │         │
│   Database   │◄────────┤
│   MongoDB    │         │
└──────┬───────┘         │
       │                 │
       │ Status:         │
       │ PENDING         │
       ▼                 │
┌──────────────┐        │
│ Admin Panel  │        │
│     🛡️      │        │
└──────┬───────┘        │
       │                 │
       │ Approve         │
       │ for Forum       │
       │                 │
       └─────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │Public Forum  │
                  │Shows Approved│
                  │Complaints 👥 │
                  └──────────────┘
```

---

## 🎯 Key Routes Summary

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page with forum/submit links |
| `/forum` | Public | Facebook-like feed of approved complaints |
| `/submit-complaint` | Public | Anonymous complaint submission form |
| `/track-complaint` | Public | Track complaint by Anonymous ID |
| `/admin/complaints` | Admin Only | Complaint management panel |
| `/admin/dashboard` | Admin Only | Admin dashboard |

---

## 🔐 Security Flow

```
User Submits Complaint
         ↓
Anonymous ID Generated (ANON-2025-XXXXXXXX)
         ↓
Stored in Database (Status: PENDING)
         ↓
Admin Reviews in Panel (/admin/complaints)
         ↓
Admin Takes Action:
  ├─ Verify ✅
  ├─ Reject ❌
  └─ Approve for Forum ✓
         ↓
If Approved → Appears in Public Forum (/forum)
If Not Approved → Stays Private
```

---

## 📱 Access Points to Forum

From Homepage:
1. **Hero Section Button** - "View Community Forum"
2. **Feature Card** - "Public Harassment Forum" (clickable)
3. **Direct URL** - `/forum`

From Employee Dashboard:
1. **Sidebar** - "Public Forum" menu item
2. **Quick Links** - Featured on home

From Admin Panel:
1. **Manage Complaints** - Approve for forum
2. **View approved posts** - Link to forum

---

## 🎉 System Highlights

✅ **3 Public Access Points** to Forum from Homepage  
✅ **5-Step Complaint Submission** with Evidence  
✅ **Admin Approval Required** for Forum Visibility  
✅ **Complete Status Tracking** by Anonymous ID  
✅ **Facebook-like Community** with Reactions & Comments  
✅ **Full Admin Control** over All Complaints  

---

**Ready to Test!** 🚀  
Start both servers and navigate through the complete user journey!
