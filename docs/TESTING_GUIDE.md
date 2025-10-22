# 🧪 SafeDesk Testing Guide - Anonymous Complaint System

## 🚀 Quick Start Testing

### Prerequisites
- ✅ Node.js v24.8.0 installed
- ✅ MongoDB running
- ✅ All dependencies installed

### Start Servers

**Terminal 1 - Backend Server:**
```powershell
cd server-site
npm start
```
Expected output: `Server running on http://localhost:3000`

**Terminal 2 - Frontend Server:**
```powershell
npm run dev
```
Expected output: `Local: http://localhost:5173/`

---

## 📋 Testing Checklist

### ✅ Phase 1: Homepage Integration

#### Test 1: Landing Page Access
1. Open browser: `http://localhost:5173/`
2. **Verify:**
   - ✓ Hero section displays
   - ✓ Two buttons visible:
     - "Submit Anonymous Report" (dark blue)
     - "View Community Forum" (white with border)
   - ✓ Feature cards display
   - ✓ "Anonymous Complaint System" card has "Learn More"
   - ✓ "Public Harassment Forum" card has "Learn More"

#### Test 2: Navigation Links
1. Click **"Submit Anonymous Report"** button
   - Should navigate to `/submit-complaint`
   - 5-step form should load
2. Go back, click **"View Community Forum"** button
   - Should navigate to `/forum`
   - Public forum feed should load
3. Scroll to features, click **"Anonymous Complaint System"** card
   - Should navigate to `/submit-complaint`
4. Click **"Public Harassment Forum"** card
   - Should navigate to `/forum`
5. Scroll to "How It Works" section
6. Click **"Begin Your Report"** button
   - Should navigate to `/submit-complaint`

**Expected Result:** All 5 navigation points work correctly ✅

---

### ✅ Phase 2: Anonymous Complaint Submission

#### Test 3: Submit a Complaint

**Step 1 - Incident Details:**
1. Navigate to `/submit-complaint`
2. Fill out form:
   - Title: "Test Harassment Incident"
   - Description: "This is a test complaint to verify the system works properly."
   - Type: Select "Harassment"
   - Priority: Select "High"
3. Click **"Continue"**

**Step 2 - Evidence Upload:**
1. Click "Upload Files" (optional for testing)
2. Add Evidence URL:
   - Description: "Screenshot of incident"
   - URL: "https://example.com/evidence"
3. Click **"Continue"**

**Step 3 - Witness Verification:**
1. Enter witness email: "witness1@test.com"
2. Click **"Add Witness"**
3. Repeat for 4 more witnesses (total 5)
4. Click **"Generate Form & Continue"**
5. **Verify:** Witness form URL is generated

**Step 4 - Incident Context:**
1. Fill out:
   - Date: Select today's date
   - Time: "14:30"
   - Location: "Conference Room B"
   - Witnesses Present: Yes
   - Previous Reports: No
2. Click **"Continue"**

**Step 5 - Review & Submit:**
1. Review all information
2. Check "I confirm this information is accurate"
3. Click **"Submit Complaint"**
4. **Verify:**
   - Success alert appears
   - Anonymous ID shown (format: ANON-2025-XXXXXXXX)
   - **COPY THIS ID** for later testing

**Expected Result:** Complaint submitted successfully with unique ID ✅

---

### ✅ Phase 3: Track Complaint Status

#### Test 4: Track Your Complaint
1. Navigate to `/track-complaint`
2. Paste the Anonymous ID from Test 3
3. Click **"Track Complaint"**
4. **Verify:**
   - Complaint details load
   - Status shows: "Pending" (yellow badge)
   - Timeline shows "Submitted" step
   - Title and description match
   - Evidence is listed
5. Click **"Download Report"**
   - Alert should show "Report downloaded"

**Expected Result:** Complaint tracking works correctly ✅

---

### ✅ Phase 4: Admin Panel - Complaint Management

#### Test 5: Access Admin Panel
1. Login as Admin user
2. Navigate to sidebar
3. Click **"Manage Complaints"** (3rd menu item)
4. **Verify:**
   - URL: `/admin/complaints`
   - Complaint table loads
   - Your test complaint appears in table

#### Test 6: Filter and Search
1. Click **"Pending"** status card at top
   - Table should show only pending complaints
2. Click **"All"** to reset
3. In search bar, type: "Test Harassment"
   - Your complaint should appear
4. Type the Anonymous ID
   - Should find your specific complaint

**Expected Result:** Filtering and search work correctly ✅

#### Test 7: View Complaint Details
1. Find your test complaint in table
2. Click **"View"** button in Actions column
3. **Verify Modal Opens:**
   - Anonymous ID displayed
   - Status badge: "Pending" (yellow)
   - Priority: "High"
   - Category shown
   - Full title and description visible
   - Evidence section shows your URL
   - Admin action buttons visible

**Expected Result:** Detail modal displays complete information ✅

#### Test 8: Update Complaint Status
1. In detail modal, click **"Review"** button
2. Add admin notes: "Reviewing for authenticity"
3. Click "OK"
4. **Verify:**
   - Success alert appears
   - Status updates to "Under Review" (blue badge)
5. Click **"Verify"** button
6. Add admin notes: "Verified as legitimate"
7. Click "OK"
8. **Verify:**
   - Status updates to "Verified" (green badge)

**Expected Result:** Status updates work correctly ✅

#### Test 9: Approve for Forum
1. In detail modal (complaint still open)
2. Scroll to "Admin Actions"
3. Click **"Approve for Forum"** button
4. Confirmation dialog appears:
   - "Approve for Public Forum?"
   - "This complaint will be visible to all users"
5. Click **"Yes, Approve"**
6. **Verify:**
   - Success alert: "Approved!"
   - Forum status changes in table
7. Close modal
8. Refresh table
9. **Verify:** "Forum" column shows "Public" (green badge)

**Expected Result:** Forum approval works correctly ✅

---

### ✅ Phase 5: Public Forum

#### Test 10: View in Public Forum
1. Open new browser tab (or logout from admin)
2. Navigate to `http://localhost:5173/forum`
3. **Verify:**
   - Statistics dashboard shows at top
   - Your approved complaint appears in feed
   - Post card displays:
     - Anonymous ID: ANON-2025-XXXXXXXX
     - Title: "Test Harassment Incident"
     - Description preview
     - Priority badge: "High" (orange)
     - Evidence indicator: "📎 1 evidence"
   - Reaction buttons visible:
     - 🙏 Support
     - 😟 Concern
     - 👊 Me Too / Similar Experience
   - Comment section visible

**Expected Result:** Approved complaint visible in public forum ✅

#### Test 11: Interact with Post
1. Click **"🙏 Support"** button
2. **Verify:**
   - Count increases to "1"
   - Button highlights
3. Click **"💬 Comment"** button
4. Type comment: "I experienced something similar. Thank you for sharing."
5. Click **"Post Comment"**
6. **Verify:**
   - Comment appears below post
   - Shows "Anonymous User"
   - Timestamp displays
7. Try searching for your post:
   - Use search bar: "Test Harassment"
   - Should filter to show only your post

**Expected Result:** Reactions and comments work correctly ✅

---

### ✅ Phase 6: Admin Moderation

#### Test 12: Remove from Forum
1. Go back to Admin Panel: `/admin/complaints`
2. Click **"View"** on your test complaint
3. Scroll to Admin Actions
4. Click **"Remove from Forum"** button
5. Confirmation dialog:
   - "Remove from Forum?"
   - "This complaint will be removed from public view"
6. Click **"Yes, Remove"**
7. **Verify:**
   - Success alert
   - Forum status changes to "Private" (gray badge)
8. Open new tab, go to `/forum`
9. **Verify:** Your post no longer appears

**Expected Result:** Forum removal works correctly ✅

---

## 🎯 Comprehensive Feature Testing

### Test 13: Complete User Journey

**Scenario:** New user reports harassment, admin approves, community supports

1. **User Journey:**
   ```
   Homepage → Submit Complaint → Receive ID → Track Status
   ```
   - Start at homepage
   - Click "Submit Anonymous Report"
   - Fill all 5 steps
   - Save Anonymous ID
   - Navigate to "Track Complaint"
   - Verify status

2. **Admin Journey:**
   ```
   Login → Manage Complaints → Review → Verify → Approve for Forum
   ```
   - Login as admin
   - Go to "Manage Complaints"
   - Find pending complaint
   - Update status to "Verified"
   - Approve for public forum

3. **Community Journey:**
   ```
   Homepage → View Forum → Read → React → Comment
   ```
   - Go to homepage
   - Click "View Community Forum"
   - Find approved post
   - Add support reaction
   - Post encouraging comment

**Expected Result:** Full cycle works seamlessly ✅

---

## 🐛 Edge Case Testing

### Test 14: Invalid Anonymous ID
1. Go to `/track-complaint`
2. Enter fake ID: "ANON-2025-99999999"
3. Click "Track Complaint"
4. **Verify:** Error message displays

### Test 15: Empty Forum
1. Remove all complaints from forum (admin panel)
2. Go to `/forum`
3. **Verify:** Empty state message displays

### Test 16: Pagination
1. Create 15+ complaints
2. Go to admin panel
3. **Verify:** Pagination controls appear
4. Click "Next"
5. **Verify:** Shows next 10 complaints

### Test 17: Bulk Status Filtering
1. Create complaints with different statuses
2. In admin panel, click each status filter:
   - Pending
   - Under Review
   - Verified
   - Rejected
3. **Verify:** Table shows only matching statuses

---

## 📊 Performance Testing

### Test 18: Load Test
1. Create 50+ complaints in database
2. Navigate to `/admin/complaints`
3. **Verify:**
   - Page loads within 2 seconds
   - Pagination works smoothly
4. Navigate to `/forum`
5. **Verify:**
   - Posts load efficiently
   - Infinite scroll works (if implemented)

---

## 🔒 Security Testing

### Test 19: Anonymous ID Uniqueness
1. Submit 10 complaints
2. **Verify:** Each has unique Anonymous ID
3. Check format: `ANON-YYYY-XXXXXXXX`

### Test 20: Forum Privacy
1. Submit complaint (do NOT approve for forum)
2. Go to `/forum`
3. **Verify:** Complaint does NOT appear
4. Approve in admin panel
5. Refresh forum
6. **Verify:** Complaint NOW appears

---

## ✅ Final Verification Checklist

Before marking complete, verify all these work:

- [ ] Homepage hero buttons navigate correctly
- [ ] Feature cards are clickable
- [ ] Complaint submission works (all 5 steps)
- [ ] Anonymous ID is generated correctly
- [ ] Complaint tracking works with valid ID
- [ ] Admin panel accessible at `/admin/complaints`
- [ ] Admin can filter by status
- [ ] Admin can search by title/ID
- [ ] Admin can view complaint details
- [ ] Admin can update complaint status
- [ ] Admin can approve/remove from forum
- [ ] Public forum shows only approved complaints
- [ ] Reactions work (Support/Concern/Me Too)
- [ ] Comments work
- [ ] Search and filter work in forum
- [ ] Statistics dashboard displays correctly
- [ ] Pagination works (if >10 items)
- [ ] Empty states display properly

---

## 🎉 Success Criteria

✅ **ALL FEATURES WORKING:**
- Homepage navigation (5 access points) ✓
- Anonymous complaint submission ✓
- Complaint tracking ✓
- Admin management panel ✓
- Status updates ✓
- Forum approval controls ✓
- Public forum display ✓
- Reactions and comments ✓
- Search and filter ✓

---

## 🚨 Troubleshooting

### Issue: "Cannot connect to server"
**Solution:**
```powershell
# Check if backend is running
cd server-site
npm start

# Verify MongoDB is running
# Check connection at http://localhost:3000/api/complaints
```

### Issue: "Complaint not appearing in forum"
**Solution:**
1. Check `approvedForForum` field in database
2. Verify admin approved the complaint
3. Check browser console for errors

### Issue: "Anonymous ID not working"
**Solution:**
1. Verify ID format: `ANON-2025-XXXXXXXX`
2. Check database for matching record
3. Ensure backend API is responding

---

## 📝 Test Report Template

```markdown
# Test Session Report

**Date:** _____________
**Tester:** _____________
**Browser:** _____________

## Results

| Test # | Feature | Status | Notes |
|--------|---------|--------|-------|
| 1 | Homepage Access | ✅ | All links work |
| 2 | Complaint Submission | ✅ | ID: ANON-2025-12345678 |
| 3 | Tracking | ✅ | Status displays correctly |
| 4 | Admin Panel | ✅ | All features functional |
| 5 | Public Forum | ✅ | Posts display properly |

## Issues Found
- None

## Overall Status
✅ **PASSED** - All tests successful
```

---

**Happy Testing! 🎉**  
If all tests pass, the Anonymous Complaint System is **PRODUCTION READY** ✅

