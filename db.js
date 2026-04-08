import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

;(function () {
  const supabaseConfig = window.SUPABASE_CONFIG || window.supabaseConfig || {
    url: 'https://entyqzgomudoxsnxsvrg.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVudHlxemdvbXVkb3hzbnhzdnJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1OTQwNDAsImV4cCI6MjA5MTE3MDA0MH0.xJhte_gpIUucarYR0u5BebSf-4y1ajFJbq0NEuSwBl0'
  };

  let supabaseClient = null;

  function initializeFirebase() {
    if (!supabaseConfig || !supabaseConfig.url || !supabaseConfig.anonKey) {
      return null;
    }

    if (!supabaseClient) {
      supabaseClient = createClient(supabaseConfig.url, supabaseConfig.anonKey);
    }

    return supabaseClient;
  }

  function isFirebaseReady() {
    return Boolean(initializeFirebase());
  }

  function buildPayload(reservationData) {
    const fullname = String(reservationData.fullname || '').trim();
    const email = String(reservationData.email || '').trim();
    const selectedDate = String(reservationData.selectedDate || '').trim();
    const selectedSlot = String(reservationData.selectedSlot || '').trim();

    return {
      nom: fullname,
      email: email,
      date: selectedDate,
      horaire: selectedSlot
    };
  }

  async function saveReservation(reservationData) {
    const database = initializeFirebase();

    if (!database) {
      throw new Error('Supabase n\'est pas configure.');
    }

    const payload = buildPayload(reservationData || {});

    if (!payload.nom || !payload.email || !payload.date || !payload.horaire) {
      throw new Error('Les champs nom, email, date et horaire sont obligatoires.');
    }

    const { data, error } = await database
      .from('Calysta')
      .insert([payload])
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: 'Reservation enregistree avec Supabase',
      data: data || payload
    };
  }

  function sendReservationData(reservationData) {
    if (!isFirebaseReady()) {
      return Promise.reject(new Error('Supabase n\'est pas configure.'));
    }

    return saveReservation(reservationData);
  }

  async function getBookedSlots(reservationDate) {
    const database = initializeFirebase();

    if (!database) {
      throw new Error('Supabase n\'est pas configure.');
    }

    const { data, error } = await database
      .from('Calysta')
      .select('*')
      .eq('date', reservationDate);

    if (error) {
      throw error;
    }

    return Array.isArray(data) ? data : [];
  }

  window.ReservationDB = {
    initializeFirebase,
    initializeSupabase: initializeFirebase,
    isFirebaseReady,
    isSupabaseReady: isFirebaseReady,
    sendReservationData,
    saveReservation,
    getBookedSlots
  };

  initializeFirebase();
})();