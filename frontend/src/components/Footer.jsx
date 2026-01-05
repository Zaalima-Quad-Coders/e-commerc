
import {Phone ,Mail, LinkedIn, YouTube, GitHub} from "@mui/icons-material"
import "../componentStyles/Footer.css"


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container " >
      {/* section 1 */}
        <div className="footer-section contact">
          <h3>Contact  us</h3>
          <p><Phone fontSize="small"/>Phone :122344322334 </p>
          <p><Mail fontSize="small"/>Email :xyz@gmail.com</p>
        </div>

        {/* section 2 */}
        <div className="footer-setion social">
            <h3>follow me</h3>
            <div className="social-links">
                <a href="" target="_blank">
                  <GitHub className="social-icon"/>
                </a>
                <a href="" target="_blank">
                  <LinkedIn className="social-icon"/>
                </a>
                <a href="" target="_blank">
                  <YouTube className="social-icon"/>
                </a>
            </div>
        </div>

        {/* section3  */}
        <div className="footer-section about">
            <h3>About</h3>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis quos beatae esse corporis quod eligendi delectus voluptates impedit, ea voluptatum culpa porro amet nostrum tempore officia! Maiores ad inventore sequi.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 coding.All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
 