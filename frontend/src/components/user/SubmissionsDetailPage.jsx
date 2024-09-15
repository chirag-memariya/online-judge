import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SubmissionDetailPage = () => {
  const { submissionId } = useParams(); // Get the submission ID from the URL
  // const [submissionId, setSubmissionId] = useState('66df3b6464b8a2abb41fa694');
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the submission details when the component mounts
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/submissions/${submissionId}`);
        setSubmission(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId]);


  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="ring"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!submission) {
    return <div>No submission found.</div>;
  }

  return (
    <div>
      <h2>Submission Details</h2>
      <div>
        <p><strong>Problem:</strong> {submission.problem?.title}</p>
        <p><strong>Verdict:</strong> {submission.verdict}</p>
        <p><strong>Solution:</strong></p>
        <pre style={{ background: '#f4f4f4', padding: '1em', borderRadius: '5px' }}>
          {submission.solution}
        </pre>
      </div>
    </div>
  );
};

export default SubmissionDetailPage;
