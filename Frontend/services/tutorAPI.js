import axios from "axios";

const API = "http://localhost:3000/api/tutor";

export async function getTutorDashboard(idTutor) {
  const response = await axios.get(`${API}/dashboard/${idTutor}`);
  return response.data;
}

export async function getTutorStudents(idTutor) {
  const response = await axios.get(`${API}/students/${idTutor}`);
  return response.data;
}

export async function getTutorStudentDetail(idTutor, idBeneficiario) {
  const response = await axios.get(`${API}/student/${idTutor}/${idBeneficiario}`);
  return response.data;
}

export async function getTutorMaterials(idTutor) {
  const response = await axios.get(`${API}/materials/${idTutor}`);
  return response.data;
}

export async function getTutorTracking(idTutor) {
  const response = await axios.get(`${API}/tracking/${idTutor}`);
  return response.data;
}

export async function getTutorHoursEvidence(idTutor) {
  const response = await axios.get(`${API}/hours-evidence/${idTutor}`);
  return response.data;
}