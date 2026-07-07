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
      <form onSubmit={handleVerify}>
        <input
          value={counselorId}
          onChange={(e) => setCounselorId(e.target.value)}
          placeholder="Counselor ID"
          required
        />
        <button type="submit">Verify</button>
      </form>
      {verified && (
        <p>
          {verified.name} is now verified.
        </p>
      )}
    </div>
  );
};

export default CounselorVerificationList;
