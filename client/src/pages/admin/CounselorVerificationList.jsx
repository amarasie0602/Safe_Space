import { useState } from 'react';
import api from '../../api/axios';

const CounselorVerificationList = () => {
  const [counselorId, setCounselorId] = useState('');
  const [verified, setVerified] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    const { data } = await api.post(`/admin/counselors/verify/${counselorId}`);
    setVerified(data);
    setCounselorId('');
  };

  return (
    <div>
      <h1>Verify Counselor</h1>
      <form className="form" onSubmit={handleVerify}>
        <label className="field">
          Counselor ID
          <input value={counselorId} onChange={(e) => setCounselorId(e.target.value)} required />
        </label>
        <button type="submit" className="btn btn-primary">
          Verify
        </button>
      </form>
      {verified && <p className="badge badge-success">{verified.name} is now verified.</p>}
    </div>
  );
};

export default CounselorVerificationList;
