import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <section className='text-center flex flex-col justify-center items-center h-96'>
      <h1 className='text-6xl font-bold mb-4'>404 Not Found</h1>
      <p className='text-xl mb-5'>This page does not exist</p>
      <button
        onClick={() => navigate(-1)}  // Go back one page in history
        className='text-white bg-indigo-700 hover:bg-indigo-900 rounded-md px-3 py-2 mt-4'
      >
        Go Back
      </button>
    </section>
  );
};

export default NotFoundPage;
