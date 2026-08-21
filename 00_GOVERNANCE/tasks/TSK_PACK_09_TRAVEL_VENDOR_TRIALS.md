---
hub: 00_GOVERNANCE/HUB.md
---

# ✈️ Task Pack 09: Outstation/NRI Travel & Vendor Trial Runs

**Pack ID:** `TSK_PACK_09`
**Domain Pillar:** `05_OPERATIONS_LOGISTICS`
**WBS Scope:** `5.7 Outstation/NRI Travel & Vendor Trial Runs`
**Parent Blueprint:** [`00_GOVERNANCE/MASTER_WBS_BLUEPRINT.md`](file:///d:/GitHub_Repo/Sree_Krushna/00_GOVERNANCE/MASTER_WBS_BLUEPRINT.md)

---

## Pack Overview
`TSK-304` covers airport pickup dispatch on the day itself — it assumes guests are already booked and already arriving. This pack covers what happens *before* that: getting outstation/NRI guests booked and visa-ready, and getting the catering/decor/sound vendors QA'd before they're trusted with the live event.

---

### `TSK-901`: Outstation & NRI Guest Travel Tracking
* **WBS Code:** `5.7.1`
* **Phase:** Phase 3 (T-45) to Phase 4 (T-7)
* **Lead Owner:** PER-014 (Fleet Lead)
* **Priority:** High
* **Status:** Planned
* **Linked Entities:** `PER-001..050`, `TSK-304`

#### Deliverable Description:
Maintain a per-family flight/train itinerary tracker for outstation and international guests, feeding the `TSK-304` airport/railway pickup dispatch with confirmed arrival slots.

#### Verification Checklist:
- [ ] Flight/train itinerary collected for every outstation `FAM-###` unit.
- [ ] Itinerary tracker shared with fleet dispatch (`TSK-304`) 7 days before arrival.
- [ ] Return-journey bookings tracked for post-Astamangala departures.

---

### `TSK-902`: Visa Invitation Letters for International Guests
* **WBS Code:** `5.7.2`
* **Phase:** Phase 2 (T-90)
* **Lead Owner:** Sree & Krushna
* **Priority:** High
* **Status:** Planned
* **Linked Entities:** `PER-001..050`

#### Deliverable Description:
Draft and issue formal wedding-invitation letters (with venue address and event dates) for any international guests who need one to support a tourist visa application.

#### Verification Checklist:
- [ ] List of guests requiring a visa invitation letter compiled.
- [ ] Invitation letter template drafted with venue/date details.
- [ ] Letters issued with enough runway before each guest's visa appointment.

---

### `TSK-903`: Catering Menu Tasting Session
* **WBS Code:** `5.7.3`
* **Phase:** Phase 3 (T-45)
* **Lead Owner:** PER-014 (Food Lead)
* **Priority:** High
* **Status:** Planned
* **Linked Entities:** `VDR-001`, `CTR-002`

#### Deliverable Description:
Conduct a formal tasting session with the caterer (`VDR-001`) covering every planned menu item and live counter, ahead of `TSK-202`'s final SLA sign-off.

#### Verification Checklist:
- [ ] Tasting session scheduled with full proposed menu.
- [ ] Portion size, spice level, and presentation approved item-by-item.
- [ ] Any menu changes fed back into the `CTR-002` SLA before final lock.

---

### `TSK-904`: Decor & Mandap Mockup Site Visit
* **WBS Code:** `5.7.4`
* **Phase:** Phase 3 (T-30)
* **Lead Owner:** PER-006 / PER-008
* **Priority:** Medium
* **Status:** Planned
* **Linked Entities:** `VDR-002`, `CTR-004`

#### Deliverable Description:
Walk the actual venue with the decor vendor for a mandap/stage mockup (physical or rendered) before the wedding day, confirming floral scale, color palette, and lighting rig placement.

#### Verification Checklist:
- [ ] Mockup (render or on-site sample) reviewed against `CTR-004` scope.
- [ ] Color palette and floral volume confirmed against monogram/theme colors.
- [ ] Lighting rig and generator backup placement confirmed on-site.

---

### `TSK-905`: Venue Sound Check & AV Technical Rehearsal
* **WBS Code:** `5.7.5`
* **Phase:** Phase 4 (T-7)
* **Lead Owner:** PER-014
* **Priority:** Medium
* **Status:** Planned
* **Linked Entities:** `VDR-007`, `CTR-007`

#### Deliverable Description:
Run a technical rehearsal at the actual mandap venue covering Purohit collar mics, PA coverage across the seating area, and DJ/reception sound levels, ahead of `TSK-207`'s final sign-off.

#### Verification Checklist:
- [ ] Purohit collar mic tested for mandap-area coverage.
- [ ] PA system tested for audibility at furthest guest seating row.
- [ ] Reception DJ sound levels tested against venue noise-permission limits (`TSK-604`).
