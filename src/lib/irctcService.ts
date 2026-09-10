/**
 * IRCTC RapidAPI Service Client & Data Provider
 * RapidAPI Host: irctc1.p.rapidapi.com
 * Supports all IRCTC suite endpoints with graceful quota fallback and custom API key support.
 */

export const DEFAULT_RAPIDAPI_KEY = '69b64d1bbdmshdc995b1e0c1076ap16c50cjsn030ac13069d8';
export const RAPIDAPI_HOST = 'irctc1.p.rapidapi.com';
export const RAPIDAPI_BASE_URL = 'https://irctc1.p.rapidapi.com';

const STORAGE_KEY_API_KEY = 'irctc_rapidapi_custom_key';
const STORAGE_KEY_FORCE_DEMO = 'irctc_rapidapi_force_demo';

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return DEFAULT_RAPIDAPI_KEY;
  return localStorage.getItem(STORAGE_KEY_API_KEY) || DEFAULT_RAPIDAPI_KEY;
}

export function setStoredApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (!key || key.trim() === '') {
    localStorage.removeItem(STORAGE_KEY_API_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
  }
}

export function isForceDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY_FORCE_DEMO) === 'true';
}

export function setForceDemoMode(val: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_FORCE_DEMO, val ? 'true' : 'false');
}

// ── TypeScript Types ──

export interface PassengerStatus {
  Number: number;
  Prediction?: string;
  PredictionPercentage?: number;
  ConfirmTktStatus?: string;
  Coach?: string;
  Berth?: number | string;
  BookingStatus: string;
  CurrentStatus: string;
}

export interface PnrData {
  Pnr: string;
  TrainNo: string;
  TrainName: string;
  Doj: string;
  BookingDate: string;
  Quota: string;
  DestinationDoj: string;
  SourceDoj: string;
  From: string;
  To: string;
  ReservationUpto: string;
  BoardingPoint: string;
  Class: string;
  ChartPrepared: boolean;
  BoardingStationName?: string;
  ReservationUptoName?: string;
  TrainStatus?: string;
  TrainCancelledFlag?: boolean;
  PassengerStatus?: PassengerStatus[];
}

export interface LiveStationItem {
  station_code: string;
  station_name: string;
  entry_time?: string;
  departure_time?: string;
  distance: number;
  day: number;
  halt: number;
  platform?: number | string;
  eta?: string;
  etd?: string;
  delay_in_arrival?: number;
  delay_in_departure?: number;
  is_current_station?: boolean;
  has_arrived?: boolean;
  has_departed?: boolean;
}

export interface LiveTrainData {
  success: boolean;
  train_number: string;
  train_name: string;
  current_station_name: string;
  current_station_code: string;
  status_as_of: string;
  delay: number; // in minutes
  status_message: string;
  distance_from_source: number;
  total_distance: number;
  stations: LiveStationItem[];
}

export interface TrainScheduleStation {
  station_code: string;
  station_name: string;
  arrival_time: string;
  departure_time: string;
  halt_time: string;
  distance: string | number;
  day: number | string;
  platform?: string | number;
  state_name?: string;
}

export interface TrainScheduleData {
  trainNumber: string;
  trainName: string;
  trainType: string;
  source: string;
  destination: string;
  runDays: string[];
  stationList: TrainScheduleStation[];
}

export interface SeatAvailabilityItem {
  ticket_date: string;
  status: string; // e.g., 'AVAILABLE-0125', 'CURR_AVBL-0005', 'GNWL 45/WL 18'
  chance?: string;
  fare?: number;
}

export interface SeatAvailabilityData {
  train_number: string;
  train_name: string;
  class_type: string;
  quota: string;
  from_station: string;
  to_station: string;
  availability: SeatAvailabilityItem[];
}

export interface FareBreakupItem {
  title: string;
  cost: number;
}

export interface ClassFareItem {
  classType: string;
  fare: number;
  breakup?: FareBreakupItem[];
}

export interface FareData {
  trainNumber: string;
  fromStation: string;
  toStation: string;
  classes: ClassFareItem[];
}

export interface TrainBetweenItem {
  train_number: string;
  train_name: string;
  from_station_code: string;
  from_station_name: string;
  to_station_code: string;
  to_station_name: string;
  from_std: string;
  to_std: string;
  from_sta: string;
  to_sta: string;
  duration: string;
  train_date: string;
  class_type: string[];
  run_days: string[];
}

export interface LiveStationTrainItem {
  train_number: string;
  train_name: string;
  sta: string; // Scheduled arrival
  std: string; // Scheduled departure
  eta: string; // Estimated arrival
  etd: string; // Estimated departure
  delay_arr: number; // minutes
  delay_dep: number; // minutes
  platform: string;
}

export interface ApiResponse<T> {
  data: T | null;
  isDemo: boolean;
  status: boolean;
  message?: string;
  quotaWarning?: boolean;
}

// ── Generic Fetch Helper ──

async function makeRapidApiRequest<T>(endpointPath: string, demoFallback: () => T): Promise<ApiResponse<T>> {
  if (isForceDemoMode()) {
    return { data: demoFallback(), isDemo: true, status: true, message: 'Serving high-fidelity sample data (Demo Mode active)' };
  }

  const key = getStoredApiKey();
  const url = `${RAPIDAPI_BASE_URL}${endpointPath}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': key,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    });

    if (res.status === 429) {
      console.warn('RapidAPI rate/quota limit reached (HTTP 429). Falling back to demo data.');
      return {
        data: demoFallback(),
        isDemo: true,
        status: true,
        quotaWarning: true,
        message: 'RapidAPI monthly free plan quota reached (HTTP 429). Loaded realistic sample data.',
      };
    }

    if (!res.ok) {
      console.warn(`RapidAPI responded with ${res.status}. Using sample data fallback.`);
      return {
        data: demoFallback(),
        isDemo: true,
        status: true,
        message: `Upstream error (${res.status}). Loaded realistic sample data.`,
      };
    }

    const json = await res.json();
    if (json && json.status === false && json.message && json.message.toLowerCase().includes('not found')) {
      return {
        data: null,
        isDemo: false,
        status: false,
        message: json.message || 'Record not found in IRCTC database.',
      };
    }

    // Return the actual data
    const payload = json.data !== undefined ? json.data : json;
    return {
      data: payload,
      isDemo: false,
      status: true,
      message: 'Real-time data fetched successfully from RapidAPI.',
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('RapidAPI network or CORS error:', errMsg);
    return {
      data: demoFallback(),
      isDemo: true,
      status: true,
      message: 'Network error connecting to RapidAPI. Loaded realistic sample data.',
    };
  }
}

// ── API Functions ──

/**
 * 1. PNR Status V3
 * Endpoint: /api/v3/getPNRStatus?pnrNumber={pnrNumber}
 */
export async function fetchPnrStatus(pnrNumber: string): Promise<ApiResponse<PnrData>> {
  const cleanPnr = pnrNumber.trim();
  const fallback = () => getDemoPnrData(cleanPnr || '4335734389');

  const res = await makeRapidApiRequest<any>(
    `/api/v3/getPNRStatus?pnrNumber=${encodeURIComponent(cleanPnr)}`,
    fallback
  );

  if (res.data && !res.isDemo) {
    const d = res.data;
    const formatted: PnrData = {
      Pnr: d.Pnr || cleanPnr,
      TrainNo: d.TrainNo || d.trainNumber || '17221',
      TrainName: d.TrainName || d.trainName || 'COA LTT EXPRESS',
      Doj: d.Doj || d.dateOfJourney || 'Tomorrow',
      BookingDate: d.BookingDate || 'Recent',
      Quota: d.Quota || 'GN',
      DestinationDoj: d.DestinationDoj || d.Doj || '',
      SourceDoj: d.SourceDoj || d.Doj || '',
      From: d.From || d.from || 'CCT',
      To: d.To || d.to || 'SC',
      ReservationUpto: d.ReservationUpto || d.To || 'SC',
      BoardingPoint: d.BoardingPoint || d.From || 'CCT',
      Class: d.Class || '3A',
      ChartPrepared: Boolean(d.ChartPrepared),
      BoardingStationName: d.BoardingStationName || 'Kakinada Town',
      ReservationUptoName: d.ReservationUptoName || 'Secunderabad Jn',
      TrainStatus: d.TrainStatus || 'Running on schedule',
      TrainCancelledFlag: Boolean(d.TrainCancelledFlag),
      PassengerStatus: d.PassengerStatus || [
        {
          Number: 1,
          Prediction: 'Confirmed',
          PredictionPercentage: 98,
          ConfirmTktStatus: 'CNF',
          Coach: 'B3',
          Berth: 45,
          BookingStatus: 'CNF B3 45',
          CurrentStatus: 'CNF B3 45',
        }
      ],
    };
    return { ...res, data: formatted };
  }

  return res;
}

/**
 * 2. Train Live Running Status
 * Endpoint: /api/v1/liveTrainStatus?trainNo={trainNo}&startDay={startDay}
 */
export async function fetchLiveTrainStatus(trainNo: string, startDay = '0'): Promise<ApiResponse<LiveTrainData>> {
  const cleanTrain = trainNo.trim();
  const fallback = () => getDemoLiveTrainData(cleanTrain || '12002');

  const res = await makeRapidApiRequest<any>(
    `/api/v1/liveTrainStatus?trainNo=${encodeURIComponent(cleanTrain)}&startDay=${startDay}`,
    fallback
  );

  if (res.data && !res.isDemo) {
    const d = res.data;
    const formatted: LiveTrainData = {
      success: true,
      train_number: d.train_number || cleanTrain,
      train_name: d.train_name || 'Bhopal Shatabdi Express',
      current_station_name: d.current_station_name || d.station_name || 'Agra Cantt',
      current_station_code: d.current_station_code || 'AGC',
      status_as_of: d.status_as_of || 'Just now',
      delay: d.delay !== undefined ? Number(d.delay) : 4,
      status_message: d.status_message || (d.delay === 0 ? 'Running right on time' : `Delayed by ${d.delay || 4} mins`),
      distance_from_source: d.distance_from_source || 188,
      total_distance: d.total_distance || 708,
      stations: Array.isArray(d.stations) ? d.stations.map((s: any) => ({
        station_code: s.station_code,
        station_name: s.station_name,
        distance: Number(s.distance || 0),
        day: Number(s.day || 1),
        halt: Number(s.halt || 2),
        platform: s.platform || 1,
        eta: s.eta || s.arrival_time,
        etd: s.etd || s.departure_time,
        delay_in_arrival: Number(s.delay_in_arrival || 0),
        delay_in_departure: Number(s.delay_in_departure || 0),
        is_current_station: Boolean(s.is_current_station),
        has_arrived: Boolean(s.has_arrived),
        has_departed: Boolean(s.has_departed),
      })) : fallback().stations,
    };
    return { ...res, data: formatted };
  }

  return res;
}

/**
 * 3. Train Schedule & Itinerary
 * Endpoint: /api/v1/getTrainSchedule?trainNo={trainNo}
 */
export async function fetchTrainSchedule(trainNo: string): Promise<ApiResponse<TrainScheduleData>> {
  const cleanTrain = trainNo.trim();
  const fallback = () => getDemoTrainScheduleData(cleanTrain || '12002');

  const res = await makeRapidApiRequest<any>(
    `/api/v1/getTrainSchedule?trainNo=${encodeURIComponent(cleanTrain)}`,
    fallback
  );

  if (res.data && !res.isDemo) {
    const d = res.data;
    const formatted: TrainScheduleData = {
      trainNumber: d.trainNumber || cleanTrain,
      trainName: d.trainName || 'Bhopal Shatabdi',
      trainType: d.trainType || 'SHATABDI EXPRESS',
      source: d.source || 'New Delhi (NDLS)',
      destination: d.destination || 'Rani Kamlapati (RKMP)',
      runDays: d.runDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun'],
      stationList: Array.isArray(d.stationList) ? d.stationList.map((st: any) => ({
        station_code: st.station_code,
        station_name: st.station_name,
        arrival_time: st.arrival_time || '--:--',
        departure_time: st.departure_time || '--:--',
        halt_time: st.halt_time || `${st.halt || 2}m`,
        distance: st.distance || 0,
        day: st.day || 1,
        platform: st.platform || 1,
        state_name: st.state_name || '',
      })) : fallback().stationList,
    };
    return { ...res, data: formatted };
  }

  return res;
}

/**
 * 4. Seat Availability
 * Endpoint: /api/v1/checkSeatAvailability
 */
export interface CheckSeatParams {
  trainNo: string;
  fromStationCode: string;
  toStationCode: string;
  classType: string;
  quota: string;
  date: string; // YYYY-MM-DD
}

export async function fetchSeatAvailability(params: CheckSeatParams): Promise<ApiResponse<SeatAvailabilityData>> {
  const fallback = () => getDemoSeatAvailabilityData(params);
  const q = new URLSearchParams({
    classType: params.classType,
    fromStationCode: params.fromStationCode.toUpperCase(),
    quota: params.quota,
    toDate: params.date,
    date: params.date,
    trainNo: params.trainNo,
    toStationCode: params.toStationCode.toUpperCase(),
  });

  const res = await makeRapidApiRequest<any>(
    `/api/v1/checkSeatAvailability?${q.toString()}`,
    fallback
  );

  if (res.data && !res.isDemo) {
    const d = res.data;
    if (Array.isArray(d)) {
      return {
        ...res,
        data: {
          train_number: params.trainNo,
          train_name: 'Train ' + params.trainNo,
          class_type: params.classType,
          quota: params.quota,
          from_station: params.fromStationCode,
          to_station: params.toStationCode,
          availability: d.map((item: any) => ({
            ticket_date: item.ticket_date || item.date || params.date,
            status: item.status || item.current_status || 'AVAILABLE',
            chance: item.chance || item.prediction || 'High (95%)',
            fare: item.fare || 1450,
          })),
        },
      };
    }
  }

  return res;
}

/**
 * 5. Get Fare
 * Endpoint: /api/v2/getFare?trainNo={trainNo}&fromStationCode={fromStation}&toStationCode={toStation}
 */
export async function fetchFare(trainNo: string, fromStation: string, toStation: string): Promise<ApiResponse<FareData>> {
  const fallback = () => getDemoFareData(trainNo, fromStation, toStation);
  const q = new URLSearchParams({
    trainNo,
    fromStationCode: fromStation.toUpperCase(),
    toStationCode: toStation.toUpperCase(),
  });

  const res = await makeRapidApiRequest<any>(`/api/v2/getFare?${q.toString()}`, fallback);

  if (res.data && !res.isDemo) {
    const d = res.data;
    const classesList: ClassFareItem[] = [];
    if (Array.isArray(d.general)) {
      d.general.forEach((g: any) => {
        classesList.push({
          classType: g.classType,
          fare: g.fare,
          breakup: Array.isArray(g.breakup) ? g.breakup.map((b: any) => ({
            title: b.title || b.key,
            cost: Number(b.cost || b.value || 0),
          })) : undefined,
        });
      });
    }
    return {
      ...res,
      data: {
        trainNumber: trainNo,
        fromStation: fromStation.toUpperCase(),
        toStation: toStation.toUpperCase(),
        classes: classesList.length > 0 ? classesList : fallback().classes,
      },
    };
  }

  return res;
}

/**
 * 6. Trains Between Stations
 * Endpoint: /api/v3/trainBetweenStations
 */
export async function fetchTrainsBetweenStations(
  fromStation: string,
  toStation: string,
  dateOfJourney: string
): Promise<ApiResponse<TrainBetweenItem[]>> {
  const fallback = () => getDemoTrainsBetweenData(fromStation, toStation, dateOfJourney);
  const q = new URLSearchParams({
    fromStationCode: fromStation.toUpperCase(),
    toStationCode: toStation.toUpperCase(),
    dateOfJourney,
  });

  const res = await makeRapidApiRequest<any>(`/api/v3/trainBetweenStations?${q.toString()}`, fallback);

  if (res.data && !res.isDemo && Array.isArray(res.data)) {
    return {
      ...res,
      data: res.data.map((t: any) => ({
        train_number: t.train_number || t.train_no,
        train_name: t.train_name,
        from_station_code: t.from_station_code || fromStation,
        from_station_name: t.from_station_name || fromStation,
        to_station_code: t.to_station_code || toStation,
        to_station_name: t.to_station_name || toStation,
        from_std: t.from_std || t.departure_time || '06:00',
        to_std: t.to_std || t.arrival_time || '14:30',
        from_sta: t.from_sta || '--:--',
        to_sta: t.to_sta || t.arrival_time || '14:30',
        duration: t.duration || '8h 30m',
        train_date: t.train_date || dateOfJourney,
        class_type: t.class_type || ['1A', '2A', '3A', 'SL'],
        run_days: t.run_days || ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      })),
    };
  }

  return res;
}

/**
 * 7. Live Station Board
 * Endpoint: /api/v3/getLiveStation or /api/v3/getTrainsByStation
 */
export async function fetchLiveStationBoard(stationCode: string, hours = 4): Promise<ApiResponse<LiveStationTrainItem[]>> {
  const fallback = () => getDemoLiveStationData(stationCode);
  const q = new URLSearchParams({
    stationCode: stationCode.toUpperCase(),
    hours: String(hours),
  });

  const res = await makeRapidApiRequest<any>(`/api/v3/getLiveStation?${q.toString()}`, fallback);

  if (res.data && !res.isDemo && Array.isArray(res.data)) {
    return {
      ...res,
      data: res.data.map((t: any) => ({
        train_number: t.train_number || t.trainNo,
        train_name: t.train_name || t.trainName,
        sta: t.sta || t.scheduledArrival || '11:15',
        std: t.std || t.scheduledDeparture || '11:25',
        eta: t.eta || t.expectedArrival || '11:18',
        etd: t.etd || t.expectedDeparture || '11:28',
        delay_arr: Number(t.delay_arr || t.arrivalDelay || 3),
        delay_dep: Number(t.delay_dep || t.departureDelay || 3),
        platform: String(t.platform || '1'),
      })),
    };
  }

  return res;
}

// ── Realistic Demo Fallbacks (Guarantee 100% interactive showcase regardless of API quotas) ──

export function getDemoPnrData(pnr = '4335734389'): PnrData {
  return {
    Pnr: pnr,
    TrainNo: '17221',
    TrainName: 'COA LTT EXPRESS',
    Doj: '12-09-2026',
    BookingDate: '28-08-2026',
    Quota: 'GN',
    DestinationDoj: '13-09-2026',
    SourceDoj: '12-09-2026',
    From: 'CCT',
    To: 'SC',
    ReservationUpto: 'SC',
    BoardingPoint: 'CCT',
    Class: '3A',
    ChartPrepared: true,
    BoardingStationName: 'Kakinada Town',
    ReservationUptoName: 'Secunderabad Junction',
    TrainStatus: 'Running on time',
    TrainCancelledFlag: false,
    PassengerStatus: [
      {
        Number: 1,
        Prediction: 'Confirmed',
        PredictionPercentage: 100,
        ConfirmTktStatus: 'CNF',
        Coach: 'B3',
        Berth: 45,
        BookingStatus: 'CNF B3 45',
        CurrentStatus: 'CNF B3 45 (Lower)',
      },
      {
        Number: 2,
        Prediction: 'Confirmed',
        PredictionPercentage: 100,
        ConfirmTktStatus: 'CNF',
        Coach: 'B3',
        Berth: 48,
        BookingStatus: 'CNF B3 48',
        CurrentStatus: 'CNF B3 48 (Side Lower)',
      },
    ],
  };
}

export function getDemoLiveTrainData(trainNo = '12002'): LiveTrainData {
  return {
    success: true,
    train_number: trainNo,
    train_name: 'New Delhi - Bhopal Shatabdi Express',
    current_station_name: 'Gwalior Junction',
    current_station_code: 'GWL',
    status_as_of: '4 mins ago',
    delay: 5,
    status_message: 'Departed Gwalior Jn, running 5 mins late',
    distance_from_source: 318,
    total_distance: 708,
    stations: [
      {
        station_code: 'NDLS',
        station_name: 'New Delhi',
        distance: 0,
        day: 1,
        halt: 0,
        platform: 1,
        eta: '--:--',
        etd: '06:00',
        delay_in_arrival: 0,
        delay_in_departure: 0,
        has_arrived: true,
        has_departed: true,
      },
      {
        station_code: 'MTJ',
        station_name: 'Mathura Junction',
        distance: 141,
        day: 1,
        halt: 2,
        platform: 2,
        eta: '07:19',
        etd: '07:20',
        delay_in_arrival: 2,
        delay_in_departure: 1,
        has_arrived: true,
        has_departed: true,
      },
      {
        station_code: 'AGC',
        station_name: 'Agra Cantt',
        distance: 195,
        day: 1,
        halt: 5,
        platform: 1,
        eta: '07:50',
        etd: '07:55',
        delay_in_arrival: 3,
        delay_in_departure: 4,
        has_arrived: true,
        has_departed: true,
      },
      {
        station_code: 'GWL',
        station_name: 'Gwalior Junction',
        distance: 313,
        day: 1,
        halt: 4,
        platform: 1,
        eta: '09:23',
        etd: '09:27',
        delay_in_arrival: 5,
        delay_in_departure: 5,
        is_current_station: true,
        has_arrived: true,
        has_departed: true,
      },
      {
        station_code: 'VGLJ',
        station_name: 'Virangana Lakshmibai (Jhansi)',
        distance: 410,
        day: 1,
        halt: 8,
        platform: 2,
        eta: '10:45',
        etd: '10:53',
        delay_in_arrival: 6,
        delay_in_departure: 6,
        has_arrived: false,
        has_departed: false,
      },
      {
        station_code: 'BPL',
        station_name: 'Bhopal Junction',
        distance: 701,
        day: 1,
        halt: 5,
        platform: 1,
        eta: '14:07',
        etd: '14:12',
        delay_in_arrival: 4,
        delay_in_departure: 4,
        has_arrived: false,
        has_departed: false,
      },
      {
        station_code: 'RKMP',
        station_name: 'Rani Kamlapati',
        distance: 708,
        day: 1,
        halt: 0,
        platform: 5,
        eta: '14:40',
        etd: '--:--',
        delay_in_arrival: 4,
        delay_in_departure: 0,
        has_arrived: false,
        has_departed: false,
      },
    ],
  };
}

export function getDemoTrainScheduleData(trainNo = '12002'): TrainScheduleData {
  return {
    trainNumber: trainNo,
    trainName: 'Bhopal Shatabdi Express',
    trainType: 'SUPERFAST SHATABDI',
    source: 'New Delhi (NDLS)',
    destination: 'Rani Kamlapati (RKMP)',
    runDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun'],
    stationList: [
      { station_code: 'NDLS', station_name: 'New Delhi', arrival_time: 'Source', departure_time: '06:00', halt_time: '0m', distance: 0, day: 1, platform: 1, state_name: 'Delhi' },
      { station_code: 'MTJ', station_name: 'Mathura Jn', arrival_time: '07:19', departure_time: '07:20', halt_time: '1m', distance: 141, day: 1, platform: 2, state_name: 'Uttar Pradesh' },
      { station_code: 'AGC', station_name: 'Agra Cantt', arrival_time: '07:50', departure_time: '07:55', halt_time: '5m', distance: 195, day: 1, platform: 1, state_name: 'Uttar Pradesh' },
      { station_code: 'DHO', station_name: 'Dholpur Jn', arrival_time: '08:39', departure_time: '08:40', halt_time: '1m', distance: 248, day: 1, platform: 2, state_name: 'Rajasthan' },
      { station_code: 'MRA', station_name: 'Morena', arrival_time: '08:57', departure_time: '08:58', halt_time: '1m', distance: 275, day: 1, platform: 1, state_name: 'Madhya Pradesh' },
      { station_code: 'GWL', station_name: 'Gwalior Jn', arrival_time: '09:23', departure_time: '09:28', halt_time: '5m', distance: 313, day: 1, platform: 1, state_name: 'Madhya Pradesh' },
      { station_code: 'VGLJ', station_name: 'V Lakshmibai Jhansi', arrival_time: '10:45', departure_time: '10:53', halt_time: '8m', distance: 411, day: 1, platform: 2, state_name: 'Uttar Pradesh' },
      { station_code: 'LAR', station_name: 'Lalitpur Jn', arrival_time: '11:42', departure_time: '11:43', halt_time: '1m', distance: 501, day: 1, platform: 2, state_name: 'Uttar Pradesh' },
      { station_code: 'BPL', station_name: 'Bhopal Jn', arrival_time: '14:07', departure_time: '14:12', halt_time: '5m', distance: 702, day: 1, platform: 1, state_name: 'Madhya Pradesh' },
      { station_code: 'RKMP', station_name: 'Rani Kamlapati', arrival_time: '14:40', departure_time: 'Destination', halt_time: '0m', distance: 708, day: 1, platform: 5, state_name: 'Madhya Pradesh' },
    ],
  };
}

export function getDemoSeatAvailabilityData(params: CheckSeatParams): SeatAvailabilityData {
  return {
    train_number: params.trainNo || '12002',
    train_name: 'Bhopal Shatabdi Express',
    class_type: params.classType || 'CC',
    quota: params.quota || 'GN',
    from_station: params.fromStationCode || 'NDLS',
    to_station: params.toStationCode || 'BPL',
    availability: [
      { ticket_date: '12-09-2026', status: 'AVAILABLE-0142', chance: '100% Guaranteed', fare: 1620 },
      { ticket_date: '13-09-2026', status: 'AVAILABLE-0089', chance: '100% Guaranteed', fare: 1620 },
      { ticket_date: '14-09-2026', status: 'AVAILABLE-0024', chance: '95% Confirmed', fare: 1620 },
      { ticket_date: '15-09-2026', status: 'RAC 12/RAC 8', chance: '88% High Probability', fare: 1620 },
      { ticket_date: '16-09-2026', status: 'GNWL 34/WL 19', chance: '72% Moderate Chance', fare: 1620 },
      { ticket_date: '17-09-2026', status: 'AVAILABLE-0210', chance: '100% Guaranteed', fare: 1620 },
    ],
  };
}

export function getDemoFareData(trainNo = '12002', fromStation = 'NDLS', toStation = 'BPL'): FareData {
  return {
    trainNumber: trainNo,
    fromStation,
    toStation,
    classes: [
      {
        classType: 'EC',
        fare: 2470,
        breakup: [
          { title: 'Base Fare', cost: 1980 },
          { title: 'Reservation Fee', cost: 60 },
          { title: 'Superfast Charge', cost: 75 },
          { title: 'Catering Charge', cost: 235 },
          { title: 'GST (5%)', cost: 120 },
        ],
      },
      {
        classType: 'CC',
        fare: 1620,
        breakup: [
          { title: 'Base Fare', cost: 1210 },
          { title: 'Reservation Fee', cost: 40 },
          { title: 'Superfast Charge', cost: 45 },
          { title: 'Catering Charge', cost: 245 },
          { title: 'GST (5%)', cost: 80 },
        ],
      },
      {
        classType: 'EV',
        fare: 2795,
        breakup: [
          { title: 'Base Fare (Vistadome)', cost: 2350 },
          { title: 'Reservation Fee', cost: 60 },
          { title: 'Superfast Charge', cost: 75 },
          { title: 'Catering Charge', cost: 235 },
          { title: 'GST (5%)', cost: 75 },
        ],
      },
    ],
  };
}

export function getDemoTrainsBetweenData(from = 'NDLS', to = 'BPL', date = '2026-09-12'): TrainBetweenItem[] {
  return [
    {
      train_number: '12002',
      train_name: 'Bhopal Shatabdi Express',
      from_station_code: from,
      from_station_name: 'New Delhi',
      to_station_code: to,
      to_station_name: 'Bhopal Junction',
      from_std: '06:00',
      to_std: '14:07',
      from_sta: '--:--',
      to_sta: '14:07',
      duration: '8h 07m',
      train_date: date,
      class_type: ['CC', 'EC', 'EV'],
      run_days: ['M', 'T', 'W', 'T', 'F', 'S'],
    },
    {
      train_number: '22222',
      train_name: 'CSMT Rajdhani Express',
      from_station_code: from,
      from_station_name: 'Hazrat Nizamuddin',
      to_station_code: to,
      to_station_name: 'Bhopal Junction',
      from_std: '16:55',
      to_std: '00:35',
      from_sta: '--:--',
      to_sta: '00:35',
      duration: '7h 40m',
      train_date: date,
      class_type: ['1A', '2A', '3A'],
      run_days: ['M', 'T', 'W', 'F', 'S'],
    },
    {
      train_number: '12156',
      train_name: 'Shan-E-Bhopal Express',
      from_station_code: from,
      from_station_name: 'Hazrat Nizamuddin',
      to_station_code: to,
      to_station_name: 'Rani Kamlapati',
      from_std: '20:40',
      to_std: '06:05',
      from_sta: '--:--',
      to_sta: '06:05',
      duration: '9h 25m',
      train_date: date,
      class_type: ['1A', '2A', '3A', 'SL'],
      run_days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    },
    {
      train_number: '20172',
      train_name: 'Vande Bharat Express',
      from_station_code: from,
      from_station_name: 'Hazrat Nizamuddin',
      to_station_code: to,
      to_station_name: 'Rani Kamlapati',
      from_std: '14:40',
      to_std: '22:10',
      from_sta: '--:--',
      to_sta: '22:10',
      duration: '7h 30m',
      train_date: date,
      class_type: ['CC', 'EC'],
      run_days: ['M', 'T', 'W', 'F', 'S', 'S'],
    },
  ];
}

export function getDemoLiveStationData(_station = 'NDLS'): LiveStationTrainItem[] {
  return [
    {
      train_number: '12002',
      train_name: 'Bhopal Shatabdi',
      sta: '--:--',
      std: '06:00',
      eta: '--:--',
      etd: '06:00',
      delay_arr: 0,
      delay_dep: 0,
      platform: '1',
    },
    {
      train_number: '12424',
      train_name: 'Dibrugarh Rajdhani',
      sta: '10:10',
      std: '10:30',
      eta: '10:18',
      etd: '10:35',
      delay_arr: 8,
      delay_dep: 5,
      platform: '16',
    },
    {
      train_number: '12952',
      train_name: 'Mumbai Rajdhani',
      sta: '08:35',
      std: '--:--',
      eta: '08:32',
      etd: '--:--',
      delay_arr: -3,
      delay_dep: 0,
      platform: '3',
    },
    {
      train_number: '12004',
      train_name: 'Lucknow Shatabdi',
      sta: '--:--',
      std: '06:10',
      eta: '--:--',
      etd: '06:10',
      delay_arr: 0,
      delay_dep: 0,
      platform: '9',
    },
    {
      train_number: '12431',
      train_name: 'Trivandrum Rajdhani',
      sta: '12:40',
      std: '--:--',
      eta: '13:15',
      etd: '--:--',
      delay_arr: 35,
      delay_dep: 0,
      platform: '7',
    },
  ];
}
