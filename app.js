/* ============================================================
   LOST & FOUND — Application Logic
   ============================================================ */

(() => {
  'use strict';

  // ─── Default Student Roster ─────────────────────────────────
  // Roll Number Format: YYOO + 320 (college) + CCC (course) + NNN (student no)
  // Course Codes: 100=CSE, 101=ECE, 102=ME, 103=CE, 104=EE, 
  // 105=IT, 106=BCA, 107=BBA, 108=B.Sc, 109=B.Com, 110=BA, 200=MBA, 201=MCA, 202=M.Tech
  const DEFAULT_STUDENTS = [
    { rollNo: '2200320100001', name: 'Aarav Sharma', dob: '2003-05-12', year: '3rd Year', course: 'B.Tech CSE' },
    { rollNo: '2200320100002', name: 'Priya Patel', dob: '2003-08-23', year: '3rd Year', course: 'B.Tech CSE' },
    { rollNo: '2200320101003', name: 'Rohan Gupta', dob: '2004-01-15', year: '3rd Year', course: 'B.Tech ECE' },
    { rollNo: '2200320105004', name: 'Sneha Reddy', dob: '2003-11-30', year: '3rd Year', course: 'B.Tech IT' },
    { rollNo: '2200320102005', name: 'Arjun Singh', dob: '2003-03-07', year: '3rd Year', course: 'B.Tech ME' },
    { rollNo: '2300320106006', name: 'Kavya Nair', dob: '2004-06-18', year: '2nd Year', course: 'BCA' },
    { rollNo: '2200320100007', name: 'Vikram Joshi', dob: '2003-09-25', year: '3rd Year', course: 'B.Tech CSE' },
    { rollNo: '2300320100008', name: 'Ananya Mishra', dob: '2004-02-14', year: '2nd Year', course: 'B.Tech CSE' },
    { rollNo: '2200320104009', name: 'Rahul Verma', dob: '2003-07-01', year: '3rd Year', course: 'B.Tech EE' },
    { rollNo: '2300320107010', name: 'Diya Kapoor', dob: '2004-04-10', year: '2nd Year', course: 'BBA' },
    { rollNo: '2200320101011', name: 'Karthik Menon', dob: '2003-12-22', year: '3rd Year', course: 'B.Tech ECE' },
    { rollNo: '2300320108012', name: 'Ishita Agarwal', dob: '2004-10-05', year: '2nd Year', course: 'B.Sc' },
    { rollNo: '2300320100193', name: 'Prince Kumar', dob: '2004-12-29', year: '3nd Year', course: 'B.Tech CSE' },
     { rollNo: 'OPTO-700', name: 'Anshika Goyal', dob: '2004-01-29', year: '3nd Year', course: 'B.Opto' },
  ];

  // ─── Dynamic Student Roster (localStorage-backed) ──────────
  function getStudents() {
    try {
      const stored = JSON.parse(localStorage.getItem('lf_students') || '[]');
      // Merge defaults with any newly registered students
      const allRolls = new Set(stored.map(s => s.rollNo));
      const merged = [...stored];
      DEFAULT_STUDENTS.forEach(d => {
        if (!allRolls.has(d.rollNo)) merged.push(d);
      });
      return merged;
    } catch { return [...DEFAULT_STUDENTS]; }
  }

  function saveStudents(students) {
    localStorage.setItem('lf_students', JSON.stringify(students));
  }

  // Seed defaults on first run
  if (!localStorage.getItem('lf_students')) {
    saveStudents(DEFAULT_STUDENTS);
  }

  // Alias for convenience (live reference)
  let STUDENTS = getStudents();

  // ─── Category Keywords (for auto-suggestion) ───────────────
  const CATEGORY_KEYWORDS = {
    'Keys': ['key', 'keys', 'lock', 'keychain', 'keyring'],
    'Wallet': ['wallet', 'purse', 'money', 'cash', 'card holder'],
    'Phone': ['phone', 'mobile', 'iphone', 'samsung', 'android', 'smartphone', 'cellphone'],
    'ID Card': ['id', 'identity', 'card', 'badge', 'student card', 'aadhar', 'pan'],
    'Laptop': ['laptop', 'macbook', 'notebook', 'computer', 'dell', 'hp', 'lenovo'],
    'Charger': ['charger', 'cable', 'adapter', 'charging', 'usb', 'type-c', 'lightning'],
    'Bottle': ['bottle', 'water', 'flask', 'sipper', 'thermos'],
    'Umbrella': ['umbrella', 'rain', 'parasol'],
    'Bag': ['bag', 'backpack', 'handbag', 'suitcase', 'pouch', 'tote', 'rucksack'],
    'Books': ['book', 'notebook', 'textbook', 'diary', 'register', 'notes'],
    'Earphones': ['earphone', 'earphones', 'headphone', 'headphones', 'earbud', 'airpod', 'headset'],
  };

  // ─── Category Emoji Map ────────────────────────────────────
  const CATEGORY_EMOJI = {
    'Keys': '🔑', 'Wallet': '👛', 'Phone': '📱', 'ID Card': '🪪',
    'Laptop': '💻', 'Charger': '🔌', 'Bottle': '🍶', 'Bag': '🎒',
    'Books': '📚', 'Earphones': '🎧', 'Other': '📦',
    'Watch': '⌚', 'Shoes': '👟', 'Jacket': '🧥', 'Glasses': '👓',
  };

  // ─── DOM References ────────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const DOM = {
    // Loading
    loadingScreen: $('#loadingScreen'),

    // Views
    viewLogin: $('#viewLogin'),
    viewSignup: $('#viewSignup'),
    viewDashboard: $('#viewDashboard'),
    viewList: $('#viewList'),
    viewFind: $('#viewFind'),

    // Login
    loginForm: $('#loginForm'),
    loginRollNo: $('#loginRollNo'),
    loginDob: $('#loginDob'),
    loginBtn: $('#loginBtn'),
    goToSignup: $('#goToSignup'),

    // Signup
    signupForm: $('#signupForm'),
    signupName: $('#signupName'),
    signupRollNo: $('#signupRollNo'),
    signupDob: $('#signupDob'),
    signupYear: $('#signupYear'),
    signupCourse: $('#signupCourse'),
    signupBtn: $('#signupBtn'),
    goToLogin: $('#goToLogin'),

    // Header
    headerUser: $('#headerUser'),
    welcomeTitle: $('#welcomeTitle'),

    // Dashboard
    actionList: $('#actionList'),
    actionFind: $('#actionFind'),
    statTotal: $('#statTotal'),
    statToday: $('#statToday'),
    statCategories: $('#statCategories'),
    statFound:   $('#statFound'),
    recentGrid: $('#recentGrid'),
    recentEmpty: $('#recentEmpty'),

    // Sidebar
    userPoints:      $('#userPoints'),
    pointsBar:       $('#pointsBar'),
    pointsTier:      $('#pointsTier'),
    myListingsGrid:  $('#myListingsGrid'),
    myListingsEmpty: $('#myListingsEmpty'),

    // List Item
    listItemForm: $('#listItemForm'),
    dropZone: $('#dropZone'),
    dropPrompt: $('#dropPrompt'),
    imageInput: $('#imageInput'),
    imagePreview: $('#imagePreview'),
    removeImage: $('#removeImage'),
    itemCategory: $('#itemCategory'),
    itemDescription: $('#itemDescription'),
    itemLocation: $('#itemLocation'),
    submitItemBtn: $('#submitItemBtn'),
    categorySuggestion: $('#categorySuggestion'),

    // Find Item
    searchInput: $('#searchInput'),
    clearSearch: $('#clearSearch'),
    filterPills: $('#filterPills'),
    skeletonGrid: $('#skeletonGrid'),
    findGrid: $('#findGrid'),
    findEmpty: $('#findEmpty'),
    resultsCount: $('#resultsCount'),

    // Modal
    revealModal: $('#revealModal'),
    modalClose: $('#modalClose'),
    modalImage: $('#modalImage'),
    modalCategory: $('#modalCategory'),
    modalDescription: $('#modalDescription'),
    modalLocation: $('#modalLocation'),
    modalTime: $('#modalTime'),
    modalAvatar: $('#modalAvatar'),
    modalName: $('#modalName'),
    modalRoll: $('#modalRoll'),

    // Navigation
    listBackBtn: $('#listBackBtn'),
    findBackBtn: $('#findBackBtn'),

    // Mark as Found
    markFoundBtn: $('#markFoundBtn'),

    // Toast
    toastContainer: $('#toastContainer'),
  };

  // ─── State ─────────────────────────────────────────────────
  let currentUser = null;
  let uploadedImageData = null;
  let activeFilter = 'All';
  let currentModalItemId = null;

  // ─── Helpers ───────────────────────────────────────────────
  function getItems() {
    try {
      return JSON.parse(localStorage.getItem('lf_items') || '[]');
    } catch { return []; }
  }

  function saveItems(items) {
    localStorage.setItem('lf_items', JSON.stringify(items));
  }

  function getFoundCount() {
    return parseInt(localStorage.getItem('lf_found_count') || '0');
  }

  function incrementFoundCount() {
    const count = getFoundCount() + 1;
    localStorage.setItem('lf_found_count', String(count));
    return count;
  }

  // ─── Points System ──────────────────────────────────────────
  const POINTS_PER_LISTING = 5;
  const POINTS_PER_RETURN  = 20;
  const TIERS = [
    { min: 0,   label: 'Newcomer',    color: '#94a3b8' },
    { min: 10,  label: 'Helper',      color: '#38bdf8' },
    { min: 30,  label: 'Champion',    color: '#22c55e' },
    { min: 60,  label: 'Legend',      color: '#f59e0b' },
    { min: 100, label: 'Campus Hero', color: '#ef4444' },
  ];

  function getUserPoints(rollNo) {
    try {
      const all = JSON.parse(localStorage.getItem('lf_user_points') || '{}');
      return parseInt(all[rollNo] || '0');
    } catch { return 0; }
  }

  function addUserPoints(rollNo, pts) {
    const all = JSON.parse(localStorage.getItem('lf_user_points') || '{}');
    all[rollNo] = (parseInt(all[rollNo] || '0')) + pts;
    localStorage.setItem('lf_user_points', JSON.stringify(all));
    return all[rollNo];
  }

  function getTier(points) {
    let tier = TIERS[0];
    for (const t of TIERS) {
      if (points >= t.min) tier = t;
    }
    return tier;
  }

  function relativeTime(timestamp) {
    const diff = Date.now() - new Date(timestamp).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  function getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  function toast(message, type = 'success') {
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.textContent = message;
    DOM.toastContainer.appendChild(el);
    setTimeout(() => { el.classList.add('toast-out'); }, 3000);
    setTimeout(() => { el.remove(); }, 3500);
  }

  // ─── View Navigation ──────────────────────────────────────
  function showView(viewId) {
    [DOM.viewLogin, DOM.viewSignup, DOM.viewDashboard, DOM.viewList, DOM.viewFind].forEach(v => {
      v.classList.add('hidden');
    });
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.remove('hidden');
      window.scrollTo(0, 0);
    }
  }

  // ─── Auth ──────────────────────────────────────────────────
  function login(rollNo, dob) {
    STUDENTS = getStudents(); // Refresh from localStorage
    const normalizedRoll = rollNo.trim().toUpperCase();
    const student = STUDENTS.find(s => s.rollNo === normalizedRoll && s.dob === dob);
    return student || null;
  }

  function checkSession() {
    STUDENTS = getStudents(); // Refresh from localStorage
    try {
      const session = JSON.parse(sessionStorage.getItem('lf_session'));
      if (session && session.rollNo) {
        const student = STUDENTS.find(s => s.rollNo === session.rollNo);
        if (student) {
          currentUser = student;
          return true;
        }
      }
    } catch { }
    return false;
  }

  function logout() {
    sessionStorage.removeItem('lf_session');
    currentUser = null;
    showView('viewLogin');
  }

  // ─── Dashboard ─────────────────────────────────────────────
  function renderDashboard() {
    DOM.headerUser.textContent = currentUser.name;
    DOM.welcomeTitle.textContent = `Welcome, ${currentUser.name.split(' ')[0]}!`;

    const items = getItems();
    const today = new Date().toDateString();

    // Stats
    DOM.statTotal.textContent = items.length;
    DOM.statToday.textContent = items.filter(i => new Date(i.timestamp).toDateString() === today).length;
    const cats = new Set(items.map(i => i.category));
    DOM.statCategories.textContent = cats.size;
    DOM.statFound.textContent = getFoundCount();

    // Animate stat numbers
    animateNumbers();

    // Recent items (last 3)
    const recent = items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 3);
    if (recent.length === 0) {
      DOM.recentGrid.classList.add('hidden');
      DOM.recentEmpty.classList.remove('hidden');
    } else {
      DOM.recentGrid.classList.remove('hidden');
      DOM.recentEmpty.classList.add('hidden');
      DOM.recentGrid.innerHTML = recent.map(item => createItemCard(item)).join('');
      attachCardListeners(DOM.recentGrid);
    }

    // ── Sidebar: Points ──
    renderSidebarPoints();

    // ── Sidebar: My Listings ──
    renderMyListings(items);
  }

  function renderSidebarPoints() {
    const pts = getUserPoints(currentUser.rollNo);
    const tier = getTier(pts);
    const nextTier = TIERS[TIERS.indexOf(tier) + 1];
    const maxPts = nextTier ? nextTier.min : tier.min + 50;
    const pct = Math.min(100, Math.round((pts / maxPts) * 100));

    DOM.userPoints.textContent = pts;
    DOM.pointsBar.style.width = pct + '%';
    DOM.pointsTier.textContent = tier.label;
    DOM.pointsTier.style.color = tier.color;
    DOM.pointsTier.style.background = tier.color + '18';
  }

  function renderMyListings(allItems) {
    const myItems = allItems
      .filter(i => i.uploadedBy === currentUser.rollNo)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (myItems.length === 0) {
      DOM.myListingsGrid.classList.add('hidden');
      DOM.myListingsEmpty.classList.remove('hidden');
      return;
    }

    DOM.myListingsGrid.classList.remove('hidden');
    DOM.myListingsEmpty.classList.add('hidden');

    const emoji = (cat) => CATEGORY_EMOJI[cat] || '📦';

    DOM.myListingsGrid.innerHTML = myItems.map(item => `
      <div class="my-listing-card" data-id="${item.id}">
        <div class="my-listing-top">
          <img class="my-listing-thumb" src="${item.image}" alt="${item.category}" />
          <div class="my-listing-info">
            <span class="my-listing-category">${emoji(item.category)} ${item.category}</span>
            <span class="my-listing-location">📍 ${item.location}</span>
            <span class="my-listing-time">${relativeTime(item.timestamp)}</span>
          </div>
        </div>
        <div class="my-listing-actions">
          <button class="btn-mark-found" data-id="${item.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/></svg>
            Mark as Found
          </button>
        </div>
      </div>
    `).join('');

    // Attach Mark as Found listeners
    DOM.myListingsGrid.querySelectorAll('.btn-mark-found').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const itemId = btn.dataset.id;
        const confirmAction = confirm('Owner has collected this item? It will be removed and you earn +20 points!');
        if (!confirmAction) return;

        let items = getItems();
        items = items.filter(i => i.id !== itemId);
        saveItems(items);
        incrementFoundCount();
        addUserPoints(currentUser.rollNo, POINTS_PER_RETURN);
        toast(`Item returned! +${POINTS_PER_RETURN} Karma Points 🎉`, 'success');
        renderDashboard();
      });
    });
  }

  function animateNumbers() {
    $$('.stat-number').forEach(el => {
      const target = parseInt(el.textContent);
      if (target === 0) return;
      let current = 0;
      const step = Math.max(1, Math.floor(target / 20));
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        el.textContent = current;
      }, 30);
    });
  }

  // ─── Item Card HTML ────────────────────────────────────────
  function createItemCard(item) {
    const emoji = CATEGORY_EMOJI[item.category] || '📦';
    const time = relativeTime(item.timestamp);

    return `
      <div class="item-card" data-id="${item.id}">
        <img class="item-card-img" src="${item.image}" alt="${item.category}" loading="lazy" />
        <div class="item-card-body">
          <div class="item-card-top">
            <span class="item-card-category">${emoji} ${item.category}</span>
            <span class="item-card-time">${time}</span>
          </div>
          <div class="item-card-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor" opacity="0.6"/><circle cx="12" cy="9" r="2.5" fill="#0a0e1a"/></svg>
            ${item.location}
          </div>
          <p class="item-card-desc">${item.description}</p>
        </div>
        <div class="item-card-footer">
          <span class="item-card-reveal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/></svg>
            View finder details
          </span>
        </div>
      </div>
    `;
  }

  function attachCardListeners(container) {
    container.querySelectorAll('.item-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const items = getItems();
        const item = items.find(i => i.id === id);
        if (item) openModal(item);
      });
    });
  }

  // ─── Modal ─────────────────────────────────────────────────
  function openModal(item) {
    DOM.modalImage.src = item.image;
    DOM.modalCategory.textContent = `${CATEGORY_EMOJI[item.category] || '📦'} ${item.category}`;
    DOM.modalDescription.textContent = item.description;
    DOM.modalLocation.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor" opacity="0.6"/><circle cx="12" cy="9" r="2.5" fill="#0a0e1a"/></svg> ${item.location}`;
    DOM.modalTime.innerHTML = `🕐 ${relativeTime(item.timestamp)}`;

    // Uploader info
    STUDENTS = getStudents();
    const student = STUDENTS.find(s => s.rollNo === item.uploadedBy);
    if (student) {
      DOM.modalAvatar.textContent = getInitials(student.name);
      DOM.modalName.textContent = student.name;
      DOM.modalRoll.textContent = student.rollNo;
    } else {
      DOM.modalAvatar.textContent = '?';
      DOM.modalName.textContent = 'Unknown';
      DOM.modalRoll.textContent = item.uploadedBy;
    }

    DOM.revealModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    currentModalItemId = item.id;

    // Show "Mark as Found" only if the current user is the uploader
    if (currentUser && currentUser.rollNo === item.uploadedBy) {
      DOM.markFoundBtn.classList.remove('hidden');
    } else {
      DOM.markFoundBtn.classList.add('hidden');
    }
  }

  function closeModal() {
    DOM.revealModal.classList.add('hidden');
    document.body.style.overflow = '';
    currentModalItemId = null;
    DOM.markFoundBtn.classList.add('hidden');
  }

  // ─── Image Upload ──────────────────────────────────────────
  function handleImageFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('Please upload an image file.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast('Image must be under 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImageData = e.target.result;
      DOM.imagePreview.src = uploadedImageData;
      DOM.imagePreview.classList.remove('hidden');
      DOM.removeImage.classList.remove('hidden');
      DOM.dropPrompt.classList.add('hidden');
    };
    reader.readAsDataURL(file);
  }

  function clearImage() {
    uploadedImageData = null;
    DOM.imagePreview.src = '';
    DOM.imagePreview.classList.add('hidden');
    DOM.removeImage.classList.add('hidden');
    DOM.dropPrompt.classList.remove('hidden');
    DOM.imageInput.value = '';
  }

  // ─── Category Auto-Suggestion ──────────────────────────────
  function suggestCategory(text) {
    const lower = text.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          return category;
        }
      }
    }
    return null;
  }

  // ─── Find / Search ─────────────────────────────────────────
  function renderFindGrid() {
    const items = getItems();
    const query = DOM.searchInput.value.toLowerCase().trim();

    // Filter
    let filtered = items;

    if (activeFilter !== 'All') {
      filtered = filtered.filter(i => i.category === activeFilter);
    }

    if (query) {
      filtered = filtered.filter(i =>
        i.description.toLowerCase().includes(query) ||
        i.category.toLowerCase().includes(query) ||
        i.location.toLowerCase().includes(query)
      );
    }

    // Sort descending by timestamp
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Update results count
    DOM.resultsCount.textContent = `${filtered.length} item${filtered.length !== 1 ? 's' : ''} found`;

    // Show/hide clear button
    DOM.clearSearch.classList.toggle('hidden', !query);

    // Hide skeleton, show grid
    DOM.skeletonGrid.classList.add('hidden');

    if (filtered.length === 0) {
      DOM.findGrid.classList.add('hidden');
      DOM.findEmpty.classList.remove('hidden');
    } else {
      DOM.findGrid.classList.remove('hidden');
      DOM.findEmpty.classList.add('hidden');
      DOM.findGrid.innerHTML = filtered.map((item, i) => {
        const card = createItemCard(item);
        // Add staggered animation delay
        return card.replace('class="item-card"', `class="item-card" style="animation-delay:${i * 0.06}s"`);
      }).join('');
      attachCardListeners(DOM.findGrid);
    }
  }

  // ─── Submit Item ───────────────────────────────────────────
  function submitItem() {
    const category = DOM.itemCategory.value;
    const description = DOM.itemDescription.value.trim();
    const location = DOM.itemLocation.value;

    if (!uploadedImageData) { toast('Please upload an image of the item.', 'error'); return; }
    if (!category) { toast('Please select a category.', 'error'); return; }
    if (!description) { toast('Please add a description.', 'error'); return; }
    if (!location) { toast('Please select the location.', 'error'); return; }

    const item = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      image: uploadedImageData,
      category,
      description,
      location,
      uploadedBy: currentUser.rollNo,
      timestamp: new Date().toISOString(),
    };

    const items = getItems();
    items.push(item);
    saveItems(items);

    // Reset form
    clearImage();
    DOM.listItemForm.reset();
    DOM.categorySuggestion.classList.add('hidden');

    // Show loading state briefly
    DOM.submitItemBtn.classList.add('loading');
    setTimeout(() => {
      DOM.submitItemBtn.classList.remove('loading');
      toast('Item listed successfully! 🎉', 'success');
      showView('viewDashboard');
      renderDashboard();
    }, 800);
  }

  // ─── Event Listeners ──────────────────────────────────────
  function initEvents() {
    // Login
    DOM.loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rollNo = DOM.loginRollNo.value;
      const dob = DOM.loginDob.value;

      DOM.loginBtn.classList.add('loading');
      setTimeout(() => {
        const student = login(rollNo, dob);
        DOM.loginBtn.classList.remove('loading');
        if (student) {
          currentUser = student;
          sessionStorage.setItem('lf_session', JSON.stringify({ rollNo: student.rollNo }));
          toast(`Welcome, ${student.name}!`, 'success');
          showView('viewDashboard');
          renderDashboard();
        } else {
          toast('Invalid roll number or date of birth.', 'error');
        }
      }, 600);
    });

    // Logout buttons
    $$('#logoutBtn, #logoutBtn2, #logoutBtn3').forEach(btn => {
      if (btn) btn.addEventListener('click', logout);
    });

    // Login ↔ Signup toggle
    DOM.goToSignup.addEventListener('click', (e) => {
      e.preventDefault();
      showView('viewSignup');
    });
    DOM.goToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      showView('viewLogin');
    });

    // Signup form submission
    DOM.signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = DOM.signupName.value.trim();
      const rollNo = DOM.signupRollNo.value.trim().toUpperCase();
      const dob = DOM.signupDob.value;
      const year = DOM.signupYear.value;
      const course = DOM.signupCourse.value;

      // Validate
      if (!name || name.length < 2) { toast('Please enter your full name.', 'error'); return; }
      if (!rollNo) { toast('Please enter your roll number.', 'error'); return; }
      if (!/^\d{13}$/.test(rollNo)) { toast('Roll number must be exactly 13 digits.', 'error'); return; }
      if (rollNo.substring(4, 7) !== '320') { toast('Invalid college code. Must contain 320 at positions 5-7.', 'error'); return; }
      if (!dob) { toast('Please select your date of birth.', 'error'); return; }
      if (!year) { toast('Please select your current year.', 'error'); return; }
      if (!course) { toast('Please select your course.', 'error'); return; }

      // Check uniqueness
      STUDENTS = getStudents();
      if (STUDENTS.find(s => s.rollNo === rollNo)) {
        toast('This roll number is already registered!', 'error');
        return;
      }

      // Register
      DOM.signupBtn.classList.add('loading');
      setTimeout(() => {
        const newStudent = { rollNo, name, dob, year, course };
        STUDENTS.push(newStudent);
        saveStudents(STUDENTS);

        DOM.signupBtn.classList.remove('loading');
        DOM.signupForm.reset();
        toast('Account created successfully! 🎉 Please sign in.', 'success');
        showView('viewLogin');

        // Pre-fill roll number on login form
        DOM.loginRollNo.value = rollNo;
      }, 800);
    });

    // Dashboard actions
    DOM.actionList.addEventListener('click', () => showView('viewList'));
    DOM.actionFind.addEventListener('click', () => {
      showView('viewFind');
      // Show skeleton briefly
      DOM.skeletonGrid.classList.remove('hidden');
      DOM.findGrid.classList.add('hidden');
      DOM.findEmpty.classList.add('hidden');
      setTimeout(() => renderFindGrid(), 500);
    });

    // Navigation back
    DOM.listBackBtn.addEventListener('click', () => { showView('viewDashboard'); renderDashboard(); });
    DOM.findBackBtn.addEventListener('click', () => { showView('viewDashboard'); renderDashboard(); });

    // Image upload
    DOM.dropZone.addEventListener('click', (e) => {
      if (e.target === DOM.removeImage || e.target.closest('.remove-image-btn')) return;
      DOM.imageInput.click();
    });
    DOM.imageInput.addEventListener('change', (e) => {
      if (e.target.files[0]) handleImageFile(e.target.files[0]);
    });
    DOM.removeImage.addEventListener('click', (e) => {
      e.stopPropagation();
      clearImage();
    });

    // Drag and drop
    DOM.dropZone.addEventListener('dragover', (e) => { e.preventDefault(); DOM.dropZone.classList.add('drag-over'); });
    DOM.dropZone.addEventListener('dragleave', () => { DOM.dropZone.classList.remove('drag-over'); });
    DOM.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      DOM.dropZone.classList.remove('drag-over');
      if (e.dataTransfer.files[0]) handleImageFile(e.dataTransfer.files[0]);
    });

    // Category auto-suggestion from description
    DOM.itemDescription.addEventListener('input', () => {
      const desc = DOM.itemDescription.value;
      const suggestion = suggestCategory(desc);
      if (suggestion && DOM.itemCategory.value !== suggestion) {
        DOM.categorySuggestion.textContent = `💡 Suggestion: ${CATEGORY_EMOJI[suggestion]} ${suggestion} — click to apply`;
        DOM.categorySuggestion.classList.remove('hidden');
        DOM.categorySuggestion.onclick = () => {
          DOM.itemCategory.value = suggestion;
          DOM.categorySuggestion.classList.add('hidden');
          toast(`Category set to ${suggestion}`, 'info');
        };
      } else {
        DOM.categorySuggestion.classList.add('hidden');
      }
    });

    // Submit item
    DOM.listItemForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitItem();
    });

    // Search
    DOM.searchInput.addEventListener('input', renderFindGrid);
    DOM.clearSearch.addEventListener('click', () => {
      DOM.searchInput.value = '';
      renderFindGrid();
    });

    // Filter pills
    DOM.filterPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill');
      if (!pill) return;
      $$('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.dataset.category;
      renderFindGrid();
    });

    // Modal
    DOM.modalClose.addEventListener('click', closeModal);
    DOM.revealModal.addEventListener('click', (e) => {
      if (e.target === DOM.revealModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !DOM.revealModal.classList.contains('hidden')) closeModal();
    });

    // Mark as Found
    DOM.markFoundBtn.addEventListener('click', () => {
      if (!currentModalItemId) return;
      const confirmAction = confirm('Are you sure the owner has collected this item? This will remove it from the listings.');
      if (!confirmAction) return;

      let items = getItems();
      items = items.filter(i => i.id !== currentModalItemId);
      saveItems(items);
      incrementFoundCount();
      closeModal();
      toast('Item marked as returned! 🎉 Great job!', 'success');

      // Re-render whichever view is visible
      if (!DOM.viewDashboard.classList.contains('hidden')) {
        renderDashboard();
      } else if (!DOM.viewFind.classList.contains('hidden')) {
        renderFindGrid();
      }
    });
  }

  // ─── Init ──────────────────────────────────────────────────
  function init() {
    // Dismiss loading screen
    setTimeout(() => {
      DOM.loadingScreen.classList.add('fade-out');
      setTimeout(() => DOM.loadingScreen.remove(), 500);
    }, 600);

    initEvents();

    // Check for existing session
    if (checkSession()) {
      showView('viewDashboard');
      renderDashboard();
    } else {
      showView('viewLogin');
    }
  }

  // ─── Seed Demo Data (first run only) ──────────────────────
  function seedDemoData() {
    // Reset stale seed data (old roll number format)
    const existingSeeded = localStorage.getItem('lf_seeded');
    if (existingSeeded === 'true') {
      const items = getItems();
      const hasOldFormat = items.some(i => i.uploadedBy && i.uploadedBy.includes('CS'));
      if (hasOldFormat) {
        localStorage.removeItem('lf_seeded');
        localStorage.removeItem('lf_items');
        localStorage.removeItem('lf_students');
      }
    }
    if (localStorage.getItem('lf_seeded')) return;

    // Create placeholder images as colored canvases with icons
    function generatePlaceholderImage(text, color1, color2) {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');

      // Gradient background
      const grad = ctx.createLinearGradient(0, 0, 400, 300);
      grad.addColorStop(0, color1);
      grad.addColorStop(1, color2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 400, 300);

      // Subtle pattern
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      for (let i = 0; i < 12; i++) {
        const x = Math.random() * 400;
        const y = Math.random() * 300;
        const r = 20 + Math.random() * 40;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Text
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = '600 28px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 200, 150);

      return canvas.toDataURL('image/jpeg', 0.7);
    }

    const demoItems = [
      {
        id: 'demo_1',
        image: generatePlaceholderImage('🔑  Silver Keys', '#1a1a2e', '#16213e'),
        category: 'Keys',
        description: 'Set of 3 silver keys found on a blue keychain with a small torch. Found near the entrance gate.',
        location: 'Parking',
        uploadedBy: '2200320101003',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo_2',
        image: generatePlaceholderImage('📱  Smartphone', '#0f3460', '#533483'),
        category: 'Phone',
        description: 'Black Samsung phone with a cracked screen protector. Found under a desk in room 204.',
        location: 'Classroom',
        uploadedBy: '2200320102005',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo_3',
        image: generatePlaceholderImage('🪪  ID Card', '#1b1b2f', '#162447'),
        category: 'ID Card',
        description: 'College ID card found on the floor. The name is partially visible. Blue lanyard attached.',
        location: 'Library',
        uploadedBy: '2300320100008',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo_4',
        image: generatePlaceholderImage('👛  Brown Wallet', '#2d132c', '#801336'),
        category: 'Wallet',
        description: 'Brown leather wallet with some cash and cards inside. No visible name. Found at a table.',
        location: 'Canteen',
        uploadedBy: '2200320100001',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo_5',
        image: generatePlaceholderImage('🎧  Earphones', '#1a1a2e', '#0f3460'),
        category: 'Earphones',
        description: 'White wireless earbuds in a charging case. Brand seems to be boAt. Found on a bench.',
        location: 'Sports Ground',
        uploadedBy: '2300320106006',
        timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo_6',
        image: generatePlaceholderImage('🍶  Water Bottle', '#1b262c', '#0f4c75'),
        category: 'Bottle',
        description: 'Blue Milton water bottle with stickers on it. 750ml size. Found after class hours.',
        location: 'Classroom',
        uploadedBy: '2300320107010',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      },
    ];

    saveItems(demoItems);
    localStorage.setItem('lf_seeded', 'true');
  }

  // Run
  seedDemoData();
  document.addEventListener('DOMContentLoaded', init);

})();
