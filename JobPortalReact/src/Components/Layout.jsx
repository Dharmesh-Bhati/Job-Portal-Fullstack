import Header2 from './Header2'
import Footer from './Footer'
import { Outlet } from 'react-router-dom';
function Layout() {
	 

	return (
		<>
			<div >
				<Header2 />
				<Outlet />
				<Footer />
			</div>

		</>
	)
}

export default Layout