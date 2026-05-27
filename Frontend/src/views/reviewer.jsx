import { Routes, Route, useNavigate } from "react-router-dom";
import ReviewerSidebar from "./reviewer/ReviewerSidebar";
import ReviewerDashboard from "./reviewer/ReviewerDashboard";
import ReviewerBeneficiarios from "./reviewer/ReviewerBeneficiarios";
import ReviewerTutores from "./reviewer/ReviewerTutores";
import ReviewerBitacoras from "./reviewer/ReviewerBitacoras";

export default function ReviewerView() {
  const navigate = useNavigate();
  const softCard = "bg-white rounded-2xl border border-slate-200 shadow-sm";

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <ReviewerSidebar />
      <main className="flex-1 p-6 space-y-6">
        <Routes>
          <Route
            path="/"
            element={<ReviewerDashboard softCard={softCard} onModuleChange={(module) => navigate(`/revisor/${module}`)} />}
          />
          <Route path="beneficiarios" element={<ReviewerBeneficiarios softCard={softCard} />} />
          <Route path="tutores" element={<ReviewerTutores softCard={softCard} />} />
          <Route path="bitacoras" element={<ReviewerBitacoras softCard={softCard} />} />
        </Routes>
      </main>
    </div>
  );
}
