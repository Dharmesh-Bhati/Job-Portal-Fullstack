import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom';
function HomeLayout() {


	return (
		<>
			<div className="main-layout-container">
				<Header />
				<Outlet />
				<Footer />
			</div>

		</>
	)
}

export default HomeLayout