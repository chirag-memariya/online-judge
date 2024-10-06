import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react'; // Icons from Lucide React

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
      <div className="flex justify-center items-center h-64 relative">
        <div className="relative">
          <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
          
          {/* Gradient ring */}
          <div className="absolute inset-0 -m-2">
            <div className="h-20 w-20 rounded-full border-4 border-transparent 
                            bg-gradient-to-r from-blue-500 to-purple-500 
                            opacity-20 animate-spin [animation-duration:3s]" 
                 style={{ clipPath: 'inset(0 0 50% 50%)' }}></div>
          </div>
          
          {/* Orbiting dots */}
          {[...Array(8)].map((_, i) => (
            <div key={i} 
                 className="absolute inset-0 animate-spin"
                 style={{ 
                   animationDuration: '3s',
                   transform: `rotate(${i * 45}deg)`
                 }}>
              <div className="h-2 w-2 rounded-full bg-blue-500 absolute -top-1"
                   style={{
                     animationDelay: `${i * 0.2}s`,
                     opacity: 0.4 + (i * 0.1)
                   }}></div>
            </div>
          ))}
        </div>
        
        {/* Optional progress bar */}
        <div className="absolute bottom-0 w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
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
