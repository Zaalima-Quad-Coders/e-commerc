
import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import '../componentStyles/Navbar.css'
import { Close, Menu, PersonAdd, Search, ShoppingCart } from '@mui/icons-material';
import '../pageStyles/Search.css'
// import SearchIcon from '@mui/icons-material/Search';


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen,setIsSearchopen] = useState(false);
    const [searchQuery,setSearcQuery] = useState("");
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const isAuthenticated = false ; // Replace with actual authentication logic

    return (
       <nav className='navbar'>
        <div className="navbar-container">
            <div className="navbar-logo">
                <Link to='/' onClick={()=>setIsMenuOpen(false)}>ShopeEasy</Link>
            </div>

            <div className={`navbar-links ${isMenuOpen?'active':""}`}>
                <ul>
                    <li  onClick={()=>setIsMenuOpen(false)}><Link to="/">Home</Link></li>
                    <li><Link to="/products">Productss</Link></li>
                    <li><Link to="/about-us">About Us</Link></li>
                    <li><Link to="/contact-us">Contact-us</Link></li>
                </ul>
            </div>
            <div className="navbar-icons">
                <div className="search-container">
                    <form className='search-form'>
                        <input type="text"
                        className='search-input'
                        placeholder='Search Product...'/>
                        <button className='search-icon'>
                            <Search focusable="false"/>
                        </button>
                    </form>
                </div>

                <div className="cart-container">
                    <Link to="/cart">
                        <ShoppingCart className='icon'/>
                        <span className="cart-badge">6</span>
                    </Link>
                </div>

                {!isAuthenticated && <Link to="/register" className='register-link'>
                    <PersonAdd className='icon'/>
                </Link>}
                <div className="navbar-hamburger" onClick={toggleMenu}>
                   {isMenuOpen? <Close className='icon'/>:<Menu className='icon'/> }
                </div>
            </div>
        </div>

       </nav>
  )
};
export default Navbar;