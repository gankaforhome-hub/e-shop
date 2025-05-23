import { Collections } from '@/widgets/sections/home/collections';
import { Exclusive } from '@/widgets/sections/home/exclusive';
import { Hero } from '@/widgets/sections/home/hero';
import { ProductTypes } from '@/widgets/sections/product-types/ui/product-types';
import { Products } from '@/widgets/sections/products';

// const routes = [
//   "/components",
//   "/about-us",
//   "/contacts",
//   "/cart",
//   "/collections",
//   "/collections/collectionSlug",
//   "/not-found",
//   "./m-s/vidzone",
//   "./m-s/ks",
//   "./m-s/sweet-tv",
// ];

export default function Page() {
  return (
    <>
      <Hero />
      <ProductTypes />
      <Products />
      <Collections />
      <Exclusive />
      <Collections className="" />
      <Products />
      {/* <Box className="flex flex-col items-start gap-5">
            {routes.map((route, index) => (
              <Link
                key={index}
                href={route}
                className="mx-auto block text-4xl text-rose-500 hover:text-blue-400"
              >
                page {route}
              </Link>
            ))}
          </Box> */}
      {/* Draft markup */}
      {/* <div className="grid grid-cols-1 justify-items-center gap-10">
        HEADER
        <header className="grid grid-cols-1 justify-items-center gap-10">
          <div className="container">
            <ul className="social">
              <li>
                <a href="/contacts">Icon Location</a>
              </li>
              <li>
                <a href="https://www.facebook.com/">Icon Facebook</a>
              </li>
              <li>
                {" "}
                <a href="https://www.instagram.com/">Icon Instagram</a>
              </li>
            </ul>
            <a href="/">Logo</a>
            <ul className="li">
              <a href="/contact">Icon+Contact us+Icon</a>
              <li className="li">
                <button>Icon Language</button>
              </li>
              <li className="li">
                <button>Icon Favorite</button>
              </li>
              <li className="li">
                <button>Icon Bag</button>
              </li>
            </ul>
            <div className="separator"></div>
            <nav>
              <ul>
                <li>
                  <a href="/colection">All Colections</a>
                </li>
                <li>
                  <a href="/products">Products</a>
                </li>
                <li>
                  <a href="/about-us">About Us</a>
                </li>
                <li>
                  <a href="/exclusive">Exclusive</a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        MAIN
        <main className="grid grid-cols-1 justify-items-center gap-10">
         
         
          <section className="exlusive">
            <div className="container">
              <div>
                <img src="" alt="" />
              </div>
              <div>
                <h2>INTRODUCING CREATE YOOOOOUR PLATE</h2>
                <p>
                  Ganka exclusive provide the opportunity to create your
                  customized plate. This tradition reaches back.
                </p>
                <a href="/exlusive">Discover more</a>
              </div>
            </div>
          </section>
          
          <section className="news-letter">
            <div className="container">
              <div>
                <h2>LATEST FROM GANKA</h2>
                <p>
                  Sign up for t he newsletter to stay up to date with collection
                  updates and major new products.
                </p>
                <form action="">
                  <label for="name"></label>
                  <input id="name" type="text" />
                  <label for="email"></label>
                  <input id="email" type="email" />
                  <a download={"/"}>Add File</a>
                  <button>Send request</button>
                </form>
              </div>
              <div>
                <img src="/" alt="" />
                <span>Logo</span>
              </div>
            </div>
          </section>
          <section className="feature">
            <h2 className="visually-hidden">feature section</h2>
            <ul>
              <li>
                <span>Icon</span>
                <div>
                  <h3>Complimentary Shipping & Returns</h3>
                  <h3>Complimentary Shipping & Returns</h3>
                  <p>We offer shipping and return on all Ganka orders.</p>
                </div>
              </li>
              <li>
                <span>Icon</span>
                <div>
                  <h3>Ganka At Your Service</h3>
                  <p>Our client care experts are always here to help.</p>
                </div>
              </li>
              <li>
                <span>Icon</span>
                <div>
                  <h3>The Iconic Blue Box</h3>
                  <p>Your Ganka purchase comes wrapped in our Blue Box.</p>
                </div>
              </li>
            </ul>
          </section>
          <div className="separator"></div>
        </main>
        FOOTER
        <footer>
          <div className="contacts"></div>
          <div className="colections"></div>
          <div className="services"></div>
          <div>
            <div className="stay-connected">Social Icons</div>
            <div className="payments">Payments Icon</div>
          </div>
          <div className="separator"></div>
          <div className="under-footer">
            <span className="copyright"></span>
            <span>IconShortLogo</span>
            <ul className="services">
              <li>
                <a href="">Terms & Conditions</a>
              </li>
              <li>
                <a href="">Privacy Policy</a>
              </li>
              <li>
                <a href="">Files Cookie</a>
              </li>
            </ul>
          </div>
        </footer>
      </div> */}
    </>
  );
}
