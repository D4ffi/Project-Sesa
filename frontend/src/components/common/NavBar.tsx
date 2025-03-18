import './NavBar.css'

function Navbar() {
    return (
        <div className="navbar">
          {/* <BurgerMenuIcon /> */}
          <input type="text" placeholder="Search..." className="search-bar" />
          {/* <img src="path/to/logo.svg" alt="Company Logo" className="company-logo" /> */}
        </div>
    )
}

export default Navbar