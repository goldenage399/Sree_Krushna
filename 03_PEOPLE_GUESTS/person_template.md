---
id: PER-###
full_name: "Firstname Lastname"
short_name: "Nickname"
family_id: "FAM-###"
relation_side: "Bride | Groom | Neutral"
relation_to_couple: "e.g., Maternal Uncle / Friend / Priest"
category: "Core_Couple | Immediate_Family | Extended_Family | VIP | Friend | Coordinator | Vendor_Rep"
phone: "+91-XXXXXXXXXX"
email: "person@example.com"
city: "City Name"
accommodation_required: false # true | false
assigned_room_id: "" # e.g. VEN-002-Room-301
transport_required: false # true | false
pickup_details: "" # e.g. BBS Airport Flight 6E-204 @ 14:00
dietary_preferences: "Standard Odia / Vegetarian / Diabetic"
invitation_status: "Not_Sent | Sent | Confirmed | Declined"
events_invited:
  - "EVT-001"
  - "EVT-004"
  - "EVT-005"
assigned_responsibilities:
  - "TSK-###"
---

# 👤 Person Record: PER-###

## 1. Contact & Identity Information
- **Full Name:** {{full_name}}
- **Phone:** `{{phone}}`
- **Family Unit:** [`{{family_id}}`](file:///d:/GitHub_Repo/Sree_Krushna/03_PEOPLE_GUESTS/families/)

## 2. Event Participation & Attendance
- **Invited Events:** (List of `EVT-###`)
- **RSVP Confirmation:** `Confirmed`

## 3. Logistical Arrangements
- **Accommodation:** Room Allocation details
- **Travel / Pickups:** Vehicle allocation and arrival schedule

## 4. Special Roles & Custody
- **Ritual Roles:** (e.g., Mamu / Kanyadata / Elder blessings)
- **Assigned Tasks:** [`TSK-###`](file:///d:/GitHub_Repo/Sree_Krushna/00_GOVERNANCE/tasks/)
