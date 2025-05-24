import ForgotPassword from "../components/ForgotPassword";

const ForgotPasswordPage = () => {
    return (
        <div className="bg-green-50 min-h-screen grid grid-cols-1 md:grid-cols-2">
        {/* Left Image Side with Diagonal Cut */}
        <div
          className="hidden md:block relative"
          style={{
            clipPath: "polygon(0 0, 100% 0, 70% 100%, 0% 100%)",
          }}
        >
          <img
            src="../images/background2.png"
            alt="Nature background"
            className="w-full h-full object-cover"
          />
        </div>
          
        {/* Right Form Side */}
        <div className="bg-green-50 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <ForgotPassword />
          </div>
        </div>
      </div>
    );
};

export default ForgotPasswordPage;
