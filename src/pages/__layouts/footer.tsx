import "./footer.css";
const Footer = () => {
  return (
    <>
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-col">
            <h4>company</h4>
            <ul>
              <li>
                <a href="https://www.linkedin.com/in/afandi-soufiane/">
                  about us
                </a>
                <a href="#">our services</a>
                <a href="#">privacy policy</a>
                <a href="#">affiliate program</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>get help</h4>
            <ul>
              <li>
                <a href="#">FAQ</a>
                <a href="#">returns</a>
                <a href="#">get services</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>digitalisation 4.0</h4>
            <ul>
              <li>
                <a href="#">CA Systems</a>
                <a href="#">LAD System</a>
                <a href="#">Control Systems</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>follow us</h4>
            <div className="social-links">
              <a href="#">
                <img
                  src="/static/icons/social_media/facebook.png"
                  alt=""
                  height="25"
                  width="25"
                />
              </a>
              <a href="https://www.linkedin.com/in/afandi-soufiane/">
                <img
                  src="/static/icons/social_media/linkedin.png"
                  alt=""
                  height="25"
                  width="25"
                />
              </a>
              <a>
                <img
                  src="/static/icons/social_media/twitter.png"
                  alt=""
                  height="25"
                  width="25"
                />
              </a>
              <a>
                <img
                  src="/static/icons/social_media/instagram.png"
                  alt=""
                  height="25"
                  width="25"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
