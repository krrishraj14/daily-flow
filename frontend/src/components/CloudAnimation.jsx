export default function CloudAnimation({ darkMode = false }) {
  const cloudColor = darkMode ? '#7dd3fc' : '#4c9beb'
  return (
    <div className="flex items-center justify-center">
      <style>{`
        @keyframes sunshines {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        @keyframes clouds {
          0% {
            transform: translateX(15px);
          }
          50% {
            transform: translateX(0px);
          }
          100% {
            transform: translateX(15px);
          }
        }

        .cloud-front {
          padding-top: 45px;
          margin-left: 25px;
          display: inline;
          position: absolute;
          z-index: 11;
          animation: clouds 8s infinite;
          animation-timing-function: ease-in-out;
        }

        .cloud-back {
          margin-top: -30px;
          margin-left: 150px;
          z-index: 12;
          animation: clouds 12s infinite;
          animation-timing-function: ease-in-out;
        }

        .cloud-part {
          display: inline-block;
          background-color: ${cloudColor};
        }

        .right-front {
          width: 45px;
          height: 45px;
          border-radius: 50% 50% 50% 0%;
          margin-left: -25px;
          z-index: 5;
        }

        .left-front {
          width: 65px;
          height: 65px;
          border-radius: 50% 50% 0% 50%;
          z-index: 5;
        }

        .right-back {
          width: 50px;
          height: 50px;
          border-radius: 50% 50% 50% 0%;
          margin-left: -20px;
          z-index: 5;
        }

        .left-back {
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 0% 50%;
          z-index: 5;
        }

        .sun {
          width: 120px;
          height: 120px;
          background: linear-gradient(to right, #fcbb04, #fffc00);
          border-radius: 60px;
          display: inline;
          position: absolute;
        }

        .sun-shine {
          animation: sunshines 2s infinite;
        }

        .cloud-container {
          width: 250px;
          height: 250px;
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
      `}</style>

      <div className="cloud-container">
        <div className="cloud-front">
          <span className="cloud-part left-front"></span>
          <span className="cloud-part right-front"></span>
        </div>
        <span className="sun sun-shine"></span>
        <span className="sun"></span>
        <div className="cloud-back">
          <span className="cloud-part left-back"></span>
          <span className="cloud-part right-back"></span>
        </div>
      </div>
    </div>
  )
}
