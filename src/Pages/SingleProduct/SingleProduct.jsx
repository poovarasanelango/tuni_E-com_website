import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Header from "../../Compoment/Header/Header";
import Footer from "../../Compoment/Footer/Footer";
import DisImg from "./Assets/trust_banner_2.svg";
import "./SingleProduct.css";
import Addedeimg from "./Assets/NewImagesJoggers-0011.webp";
import Product_add from "./Product_add";
import Gpaypayment from "./Assets/secure-transaction.svg";
import Devlimg from "./Assets/delivery-sec.svg";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import SaleTimeRuning from "./SaleTimeRuning";
import {
  collection,
  addDoc,
  getFirestore,
  deleteDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Payment from "../Payment/Payment";
import AddtocartButton from "../../Compoment/AddtocartButton";
import CartItem from "../../Compoment/AddToCart/CartItem";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RatingReviews from "../Rating/RatingReviews";
import AddToCart from "../../Compoment/AddToCart/AddToCart";

const SingleProduct = () => {
  const settings = {
    customPaging: function (i) {
      return (
        <a>
          {/* <img
            src={productDetails.imageUrl[i]}
            alt={`View ${i + 1}`}
            className="img-fluid"
          /> */}
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const [showCart, setShowCart] = useState(false);
  const [countDown, setCountDown] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [cart, setCart] = useState([]);
  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [userId, setUserId] = useState(null);
  const [productDetailsCombo, setProductDetailsCombo] = useState([]);
  const [visibleShareButtons, setVisibleShareButtons] = useState(null);

  const auth = getAuth();
  const firestore = getFirestore();

  // combo products
  const fetchCartProductsCombos = async (userId) => {
    if (!userId) return;

    try {
      const firestore = getFirestore();
      const userDocRef = collection(
        firestore,
        "users",
        userId,
        "cartCollection_Combos"
      );

      const querySnapshot = await getDocs(userDocRef);

      const cartProducts = [];
      querySnapshot.forEach((doc) => {
        cartProducts.push({ id: doc.id, data: doc.data() });
      });

      // Assuming setProductDetailsCombo is a function to update your state or context
      setProductDetailsCombo(cartProducts);
      console.log(cartProducts, "addtocartpages +++cartProducts+++combos");
    } catch (error) {
      console.error("Error fetching cart products:", error);
    }
  };

  const handleRemoveFromCartCombos = (productId) => {
    const updatedCartProducts = productDetailsCombo.filter(
      (comboProduct) => comboProduct.id !== productId
    );
    setProductDetailsCombo(updatedCartProducts);
    toast.success("Successfully Cleared Combo Item");
    deleteComboItemFromFirestore(productId);
  };

  const deleteComboItemFromFirestore = async (productId) => {
    try {
      const userDocRef = doc(
        collection(firestore, "users", userId, "cartCollection_Combos"),
        productId
      );
      await deleteDoc(userDocRef);

      console.log("Combo document successfully deleted from cart!");
    } catch (error) {
      console.error("Error removing combo product from cart: ", error);
      fetchCartProductsCombos(userId);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchCartProducts(user.uid); // Fetch cart products on user login
        fetchCartProductsCombos(user.uid);
      } else {
        setUserId(null);
        setCartProducts([]); // Clear cart products on user logout
        setProductDetailsCombo([]); // Clear combo products
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // const handleQuantityChange = async (productId, newQuantity) => {
  //   try {
  //     const userDocRef = doc(
  //       collection(firestore, "users", userId, "cartCollection"),
  //       productId
  //     );
  //     await updateDoc(userDocRef, { itemCountcustomer: newQuantity });
  //     console.log("Item count updated successfully!");

  //     // Fetch and update the cart products
  //     fetchCartProducts(userId);
  //   } catch (error) {
  //     console.error("Error updating item count:", error);
  //   }
  // };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // firestore endpoint

        const paths = [
          ["clothes", "Men", "Tshirt", "full sleve", "Plain"],
          ["clothes", "Men", "Tshirt", "full sleve", "Printed"],
          ["clothes", "Men", "Tshirt", "full sleve", "check"],

          ["clothes", "Men", "Tshirt", "half sleve", "Plain"],
          ["clothes", "Men", "Tshirt", "half sleve", "Printed"],
          ["clothes", "Men", "Tshirt", "half sleve", "check"],

          ["clothes", "Men", "Tshirt", "collar", "Plain"],
          ["clothes", "Men", "Tshirt", "collar", "Printed"],
          ["clothes", "Men", "Tshirt", "collar", "check"],

          ["clothes", "Men", "Tshirt", "round neck", "Plain"],
          ["clothes", "Men", "Tshirt", "round neck", "Printed"],
          ["clothes", "Men", "Tshirt", "round neck", "check"],

          ["clothes", "Men", "Tshirt", "v-neck", "Plain"],
          ["clothes", "Men", "Tshirt", "v-neck", "Printed"],
          ["clothes", "Men", "Tshirt", "v-neck", "check"],

          ["clothes", "Men", "Shirt", "half sleve", "Plain"],
          ["clothes", "Men", "Shirt", "half sleve", "Printed"],
          ["clothes", "Men", "Shirt", "full sleve", "Plain"],
          ["clothes", "Men", "Shirt", "full sleve", "Printed"],
        ];

        for (const path of paths) {
          const productRef = doc(firestore, ...path, productId);
          const snapshot = await getDoc(productRef);
          // console.log("productId",productId);

          if (snapshot.exists()) {
            const data = { ...snapshot.data(), id: snapshot.id };
            setProductDetails(data);
            return;
          }
        }

        console.log("Product not found");
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  // 3rd -----------------------------------------

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const firestore = getFirestore();
        const productRef = collection(firestore, "cartCollection");
        const productSnapshot = await getDocs(productRef);
        const product = productSnapshot.docs.find(
          (doc) => doc.id === productId
        );

        if (product.exists()) {
          const data = { ...product.data(), id: product.id };
          setProductDetails(data);
        } else {
          console.log("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // addtocart integaration

  // const handleAddToCart = async () => {
  //   try {
  //     // Get the currently logged-in user
  //     const auth = getAuth();
  //     const user = auth.currentUser;

  //     if (!user) {
  //       console.error("User is not logged in. Cannot add to cart.");
  //       toast.error("User is not logged in. Cannot add to cart");

  //       return;
  //     }

  //     if (!selectedSize) {
  //       console.error("Please select a size before adding to cart");
  //       return;
  //     }

  //     const firestore = getFirestore();
  //     const userDocRef = doc(firestore, "users", user.uid);
  //     const cartDocRef = doc(
  //       userDocRef,
  //       "cartCollection",
  //       productId + selectedSize
  //     );
  //     const productWithSizeAndCount = {
  //       ...productDetails,
  //       sizecustomers: selectedSize,
  //       itemCountcustomer: 1,
  //     };
  //     await setDoc(cartDocRef, productWithSizeAndCount, productDetails);

  //     console.log(
  //       "Product added to the user's cart subcollection successfully!"
  //     );

  //     // Fetch and update the cart products
  //     fetchCartProducts(user.uid);
  //   } catch (error) {
  //     console.error("Error adding product to cart: ", error);
  //   }
  // };

  const handleAddToCart = async () => {
    try {
      // Get the currently logged-in user
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("User is not logged in. Cannot add to cart.");
        toast.error("User is not logged in. Cannot add to cart");

        return;
      }

      if (!selectedSize) {
        console.error("Please select a size before adding to cart");
        return;
      }

      const firestore = getFirestore();
      const userDocRef = doc(firestore, "users", user.uid);
      const cartDocRef = doc(
        userDocRef,
        "cartCollection",
        productId + selectedSize
      );
      const productWithSizeAndCount = {
        ...productDetails,
        sizecustomers: selectedSize,
        itemCountcustomer: 1,
      };
      await setDoc(cartDocRef, productWithSizeAndCount, productDetails);

      console.log(
        "Product added to the user's cart subcollection successfully!"
      );

      fetchCartProducts(user.uid);
    } catch (error) {
      console.error("Error adding product to cart: ", error);
    }
  };

  const [cartProducts, setCartProducts] = useState([]);

  // Fetch cart products

  useEffect(() => {
    if (userId) {
      fetchCartProducts(userId); // Fetch cart products when userId changes
    }
  }, [userId]);

  const fetchCartProducts = async (userId) => {
    if (!userId) return;
    try {
      const userDocRef = collection(
        firestore,
        "users",
        userId,
        "cartCollection"
      );
      const querySnapshot = await getDocs(userDocRef);

      const cartProducts = [];
      querySnapshot.forEach((doc) => {
        cartProducts.push({ id: doc.id, data: doc.data() });
      });

      setCartProducts(cartProducts);
    } catch (error) {
      console.error("Error fetching cart products:", error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const userDocRef = doc(
        collection(firestore, "users", userId, "cartCollection"),
        productId
      );
      // console.log(productId,"productIdproductIdproductIdproductIdproductId");
      await deleteDoc(userDocRef);
      console.log("Document successfully deleted from cart!");
      toast.success("Successfully Clear CartItem");

      // Fetch and display the updated cart products
      fetchCartProducts(userId);
    } catch (error) {
      console.error("Error removing product from cart: ", error);
    }
  };
  const handleQuantityChange = (productId, newQuantity, isCombo = false) => {
    if (isCombo) {
      const updatedCombos = productDetailsCombo.map((comboProduct) => {
        if (comboProduct.id === productId) {
          return {
            ...comboProduct,
            data: { ...comboProduct.data, itemCountcustomer: newQuantity },
          };
        }
        return comboProduct;
      });
      setProductDetailsCombo(updatedCombos);
    } else {
      const updatedCartProducts = cartProducts.map((cartProduct) => {
        if (cartProduct.id === productId) {
          return {
            ...cartProduct,
            data: { ...cartProduct.data, itemCountcustomer: newQuantity },
          };
        }
        return cartProduct;
      });
      setCartProducts(updatedCartProducts);
    }

    updateQuantityInFirestore(productId, newQuantity, isCombo);
  };

  const updateQuantityInFirestore = async (productId, newQuantity, isCombo = false) => {
    try {
      const collectionName = isCombo ? "cartCollection_Combos" : "cartCollection";
      const userDocRef = doc(collection(firestore, "users", userId, collectionName), productId);
      await updateDoc(userDocRef, { itemCountcustomer: newQuantity });
      console.log("Item count updated successfully!");
    } catch (error) {
      console.error("Error updating item count:", error);
      // If there's an error, revert the local state back to the previous state
      if (isCombo) {
        fetchCartProductsCombos(userId);
      } else {
        fetchCartProducts(userId);
      }
    }
  };

  const calculateTotalPrice = (cartProducts, productDetailsCombo) => {
    let totalPrice = 0;
    cartProducts.forEach((cartProduct) => {
      const price = parseInt(cartProduct.data.price);
      const count = parseInt(cartProduct.data.itemCountcustomer);
      totalPrice += price * count;
    });
    productDetailsCombo.forEach((comboProduct) => {
      const price = parseInt(comboProduct.data.productDetailsCombo.price);
      const count = parseInt(comboProduct.data.itemCountcustomer);
      totalPrice += price * count;
    });
    console.log(totalPrice,"totalPricetotalPrice");

    return totalPrice;
  };

  const totalCartPrice = calculateTotalPrice(cartProducts, productDetailsCombo);

  if (!productDetails) {
    return <p>Loading...</p>;
  }
  const handleSmallImageClick = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };
  const allSizes = ["S", "M", "L", "XL", "XXL"];
  const availableSizes = productDetails.size;


  const handleShareButtonClick = (productId) => {
    if (visibleShareButtons === productId) {
      setVisibleShareButtons(null);
    } else {
      setVisibleShareButtons(productId); 
    }
  };

  // Get the current page URL
  const currentURL = window.location.href;



  return (
    <>
      <Header />
      <div className="container my-5 fontfamily">
        <div className="row">
          <div className="col-lg-6 col-md-12 col-12 my-4">
            <div className="slider-container py-1 my-4">
              <Slider {...settings} ref={sliderRef}>
                {productDetails.imageUrl.map((imageUrl, index) => (
                  <div key={index} className="single_img">
                    <img
                      src={index === 0 ? productDetails.imageUrl[0] : imageUrl}
                      alt={`View ${index + 1}`}
                      className="img-fluid img-container"
                    />
                  </div>
                ))}
              </Slider>
            </div>
            <div className="small-images-container mt-2 ">
              {productDetails.imageUrl.map((imageUrl, index) => (
                <div
                  key={index}
                  className="small-image-box px-1 "
                  onClick={() => handleSmallImageClick(index)}
                >
                  <img
                    src={imageUrl}
                    alt={`View ${index + 1}`}
                    className="img-fluid"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-6 col-md-12 col-12 ">
            <div className="shareicons py-1 my-4">
          <div className="icon share-icon-container d-flex">
          <h2>{productDetails.name}</h2>

              <li className="list-unstyled ms-auto ">
                <a
                  className="border-0 text-primary fs-4"
                  onClick={() => handleShareButtonClick(productId)}
                >
                  <i className="bi bi-share-fill "></i>
                </a>
              </li>
              {visibleShareButtons === productId && (
                <div className="social-media-links ">
                 <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${currentURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-1 px-1"
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${currentURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-1 px-1"
                >
                  <i className="bi bi-twitter"></i>
                </a>
                  <a
                  href={`https://api.whatsapp.com/send?text=${currentURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-1 px-1"
                >
                  <i className="bi bi-whatsapp"></i>
                </a>
                </div>
              )}
            </div>
            <div className="product-details ">
              {/* <h2>{productDetails.name}</h2> */}
              <p>
                Description of the product goes here. You can provide all the
                details about the product, its features, specifications, etc.
              </p>
              <div className="product-price">
                <p>
                  <i className="bi bi-currency-rupee text_color_heading fs-3">
                    {productDetails.price}
                  </i>
                  {"\u00a0"}
                  {"\u00a0"}
                  {"\u00a0"}
                  <del className="text-muted fs-5">
                    {" "}
                    <i className="bi bi-currency-rupee"></i>2045
                  </del>
                  {"\u00a0"}
                  {"\u00a0"}
                  {"\u00a0"}
                  <span class="badge rounded-pill px-3 py-2 text_color_heading_back">
                    Save 10%
                  </span>
                </p>
                <div className="ms-auto">
                  <span class="badge rounded-pill bg-light text-dark card-text py-2 px-3 fs-5">
                    <i class="bi bi-star-fill text-warning"></i> 4.5 | 20
                  </span>
                </div>
                <p className="text-muted font_size_tax mt-4">
                  Tax included. Shipping calculated at checkout
                </p>
                <p className="text-danger font_size_bought">
                  <i class="bi bi-cart-check-fill">{"\u00a0"}</i>455 people
                  bought this in last 7 days
                </p>
                <div className="bg_sales_end">
                  <SaleTimeRuning />
                </div>

                <h3 className="fw-bold">Select Size</h3>
                <div className="d-flex my-3">
                  {/* {productDetails && (
                    <>
                      {productDetails.size.includes("S") && (
                        <button
                          type="button"
                          className={`btn btn-outline-primary rounded-pill mx-3 ${
                            selectedSize === "S" ? "active" : ""
                          }`}
                          onClick={() => handleSizeClick("S")}
                        >
                          S
                        </button>
                      )}
                      {productDetails.size.includes("M") && (
                        <button
                          type="button"
                          className={`btn btn-outline-primary rounded-pill mx-3 ${
                            selectedSize === "M" ? "active" : ""
                          }`}
                          onClick={() => handleSizeClick("M")}
                        >
                          M
                        </button>
                      )}
                      {productDetails.size.includes("L") && (
                        <button
                          type="button"
                          className={`btn btn-outline-primary rounded-pill mx-3 ${
                            selectedSize === "L" ? "active" : ""
                          }`}
                          onClick={() => handleSizeClick("L")}
                        >
                          L
                        </button>
                      )}
                      {productDetails.size.includes("XL") && (
                        <button
                          type="button"
                          className={`btn btn-outline-primary rounded-pill mx-3 ${
                            selectedSize === "XL" ? "active" : ""
                          }`}
                          onClick={() => handleSizeClick("XL")}
                        >
                          XL
                        </button>
                      )}
                      {productDetails.size.includes("XS") && (
                        <button
                          type="button"
                          className={`btn btn-outline-primary rounded-pill mx-3 ${
                            selectedSize === "XS" ? "active" : ""
                          }`}
                          onClick={() => handleSizeClick("XS")}
                        >
                          XS
                        </button>
                      )}
                      {productDetails.size.includes("XXL") && (
                        <button
                          type="button"
                          className={`btn btn-outline-primary rounded-pill mx-3 ${
                            selectedSize === "XXL" ? "active" : ""
                          }`}
                          onClick={() => handleSizeClick("XXL")}
                        >
                          XXL
                        </button>
                      )}
                    </>
                  )} */}
                  <div className="size-options">
                    {allSizes.map((size) => (
                      <button
                        key={size}
                        className={`btn me-2 mb-2 ${
                          selectedSize === size
                            ? "btn-dark text-light"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => handleSizeClick(size)}
                        disabled={!availableSizes.includes(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-center my-3">
                  {selectedSize ? (
                    <AddtocartButton
                      selectedSize={selectedSize}
                      productDetails={productDetails}
                      onAddToCart={handleAddToCart}
                    />
                  ) : (
                    <p className="text-danger">Please select size</p>
                  )}
                </div>

                <div className="">
                  <img src={DisImg} alt="" className="img-fluid img_size" />
                </div>
              </div>

              {/* offcanva */}

              {/* This added to cart show */}
              <div
                className={`offcanvas offcanvas-end ${showCart ? "show" : ""}`}
                tabIndex="-1"
                id="offcanvasRightADDCARD"
                aria-labelledby="offcanvasRightLabel"
              >
                <div className="offcanvas-header">
                  <h5 className="fw-bold">Shopping Cart</h5>
                  <button
                    type="button"
                    className="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="offcanvas-body overflow-y-auto">
                  <div>
                    <CartItem
                      cartProducts={cartProducts}
                      handleRemoveFromCart={handleRemoveFromCart}
                      handleQuantityChange={handleQuantityChange}
                      totalCartPrice={totalCartPrice}
                      handleRemoveFromCartCombos={handleRemoveFromCartCombos}
                      productDetailsCombo={productDetailsCombo}
                    />
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/*--------------------------------rating------------------ */}
        <div className="row">
          <div className="col-12">
            <RatingReviews productId={productId} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SingleProduct;

// import React, { useState, useEffect, useRef } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import Slider from "react-slick";
// import Header from "../../Compoment/Header/Header";
// import Footer from "../../Compoment/Footer/Footer";
// import DisImg from "./Assets/trust_banner_2.svg";
// import "./SingleProduct.css";
// import Product_add from "./Product_add";
// import SaleTimeRuning from "./SaleTimeRuning";
// import { doc, getDoc, getDocs, collection, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
// import { firestore } from "../../firebaseConfig";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import AddtocartButton from "../../Compoment/AddtocartButton";
// import CartItem from "../../Compoment/AddToCart/CartItem";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const SingleProduct = () => {
//   const settings = {
//     customPaging: function (i) {
//       return (
//         <a>
//           <img
//             src={productDetails.imageUrl[i]}
//             alt={`View ${i + 1}`}
//             className="img-fluid"
//           />
//         </a>
//       );
//     },
//     dots: true,
//     dotsClass: "slick-dots slick-thumb",
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//   };

//   const navigate = useNavigate();
//   const sliderRef = useRef(null);
//   const [showCart, setShowCart] = useState(false);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const { productId } = useParams();
//   const [productDetails, setProductDetails] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [cartProducts, setCartProducts] = useState([]);
//   const auth = getAuth();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserId(user.uid);
//         fetchCartProducts(user.uid);
//       } else {
//         setUserId(null);
//         setCartProducts([]);
//       }
//     });
//     return () => unsubscribe();
//   }, [auth]);

//   const fetchCartProducts = async (userId) => {
//     if (!userId) return;
//     try {
//       const userDocRef = collection(firestore, "users", userId, "cartCollection");
//       const querySnapshot = await getDocs(userDocRef);

//       const cartProducts = [];
//       querySnapshot.forEach((doc) => {
//         cartProducts.push({ id: doc.id, data: doc.data() });
//       });

//       setCartProducts(cartProducts);
//     } catch (error) {
//       console.error("Error fetching cart products:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         const paths = [
//           ["clothes", "Men", "Tshirt", "full sleve", "Plain"],
//           ["clothes", "Men", "Tshirt", "full sleve", "Printed"],
//           ["clothes", "Men", "Tshirt", "full sleve", "check"],

//           ["clothes", "Men", "Tshirt", "half sleve", "Plain"],
//           ["clothes", "Men", "Tshirt", "half sleve", "Printed"],
//           ["clothes", "Men", "Tshirt", "half sleve", "check"],

//           ["clothes", "Men", "Tshirt", "collar", "Plain"],
//           ["clothes", "Men", "Tshirt", "collar", "Printed"],
//           ["clothes", "Men", "Tshirt", "collar", "check"],

//           ["clothes", "Men", "Tshirt", "round neck", "Plain"],
//           ["clothes", "Men", "Tshirt", "round neck", "Printed"],
//           ["clothes", "Men", "Tshirt", "round neck", "check"],

//           ["clothes", "Men", "Tshirt", "v-neck", "Plain"],
//           ["clothes", "Men", "Tshirt", "v-neck", "Printed"],
//           ["clothes", "Men", "Tshirt", "v-neck", "check"],

//           ["clothes", "Men", "Shirt", "half sleve", "Plain"],
//           ["clothes", "Men", "Shirt", "half sleve", "Printed"],
//           ["clothes", "Men", "Shirt", "full sleve", "Plain"],
//           ["clothes", "Men", "Shirt", "full sleve", "Printed"],
//         ];

//         for (const path of paths) {
//           const productRef = doc(firestore, ...path, productId);
//           const snapshot = await getDoc(productRef);

//           if (snapshot.exists()) {
//             const data = { ...snapshot.data(), id: snapshot.id };
//             setProductDetails(data);
//             return;
//           }
//         }

//         console.log("Product not found");
//       } catch (error) {
//         console.error("Error fetching product details:", error);
//       }
//     };

//     fetchProductDetails();
//   }, [productId]);

//   const handleSizeClick = (size) => {
//     setSelectedSize(size);
//   };

//   const handleAddToCart = async () => {
//     try {
//       const user = auth.currentUser;

//       if (!user) {
//         console.error("User is not logged in. Cannot add to cart.");
//         toast.error("User is not logged in. Cannot add to cart");
//         return;
//       }

//       if (!selectedSize) {
//         console.error("Please select a size before adding to cart");
//         return;
//       }

//       const userDocRef = doc(firestore, "users", user.uid);
//       const cartDocRef = doc(userDocRef, "cartCollection", productId + selectedSize);
//       const productWithSizeAndCount = {
//         ...productDetails,
//         sizecustomers: selectedSize,
//         itemCountcustomer: 1,
//       };
//       await setDoc(cartDocRef, productWithSizeAndCount);

//       console.log("Product added to the user's cart subcollection successfully!");
//       fetchCartProducts(user.uid);
//     } catch (error) {
//       console.error("Error adding product to cart: ", error);
//     }
//   };

//   const handleRemoveFromCart = async (productId) => {
//     try {
//       const userDocRef = doc(collection(firestore, "users", userId, "cartCollection"), productId);
//       await deleteDoc(userDocRef);
//       console.log("Document successfully deleted from cart!");
//       toast.success("Successfully Clear CartItem");
//       fetchCartProducts(userId);
//     } catch (error) {
//       console.error("Error removing product from cart: ", error);
//     }
//   };

//   const handleQuantityChange = async (productId, newQuantity) => {
//     try {
//       const userDocRef = doc(collection(firestore, "users", userId, "cartCollection"), productId);
//       await updateDoc(userDocRef, { itemCountcustomer: newQuantity });
//       console.log("Item count updated successfully!");
//       fetchCartProducts(userId);
//     } catch (error) {
//       console.error("Error updating item count:", error);
//     }
//   };

//   const calculateTotalPrice = (cartProducts) => {
//     let totalPrice = 0;
//     if (cartProducts) {
//       cartProducts.forEach((cartProduct) => {
//         const price = parseInt(cartProduct.data.price);
//         const count = parseInt(cartProduct.data.itemCountcustomer);
//         totalPrice += price * count;
//       });
//     }
//     return totalPrice;
//   };

//   const totalCartPrice = calculateTotalPrice(cartProducts);

//   if (!productDetails) {
//     return <p>Loading...</p>;
//   }

//   const handleSmallImageClick = (index) => {
//     if (sliderRef.current) {
//       sliderRef.current.slickGoTo(index);
//     }
//   };

// const allSizes = [ "S", "M", "L", "XL", "XXL"];
// const availableSizes = productDetails.size;

//   return (
//     <>
//       <Header />
//       <div className="container my-5 fontfamily">
//         <div className="row">
//           <div className="col-lg-6 col-md-12 col-12">
//             <div className="slider-container">
//               <Slider {...settings} ref={sliderRef}>
//                 {productDetails.imageUrl.map((imageUrl, index) => (
//                   <div key={index} className="single_img">
//                     <img
//                       src={index === 0 ? productDetails.imageUrl[0] : imageUrl}
//                       alt={`View ${index + 1}`}
//                       className="img-fluid img-container"
//                     />
//                   </div>
//                 ))}
//               </Slider>
//             </div>
//             <div className="small-images-container mt-3">
//               {productDetails.imageUrl.map((imageUrl, index) => (
//                 <div
//                   key={index}
//                   className="small-image-box"
//                   onClick={() => handleSmallImageClick(index)}
//                 >
//                   <img
//                     src={imageUrl}
//                     alt={`View ${index + 1}`}
//                     className="img-fluid"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="col-lg-6 col-md-12 col-12">
//             <div className="product-details py-1 my-4">
//               <h2>{productDetails.name}</h2>
//               <p>
//                 Description of the product goes here. You can provide all the
//                 details about the product, its features, specifications, etc.
//               </p>
//               <div className="product-price">
//                 <p>
//                   <i className="bi bi-currency-rupee text_color_heading fs-3">
//                     {productDetails.price}
//                   </i>
//                   {"\u00a0"}
//                   {"\u00a0"}
//                   {"\u00a0"}
//                   <del className="text-muted fs-5">
//                     {" "}
//                     <i className="bi bi-currency-rupee"></i>2045
//                   </del>
//                   {"\u00a0"}
//                   {"\u00a0"}
//                   {"\u00a0"}
//                   <span class="badge rounded-pill px-3 py-2 text_color_heading_back">
//                     Save 10%
//                   </span>
//                 </p>
//                 <div className="ms-auto">
//                   <span class="badge rounded-pill bg-light text-dark card-text py-2 px-3 fs-5">
//                     <i class="bi bi-star-fill text-warning"></i> 4.5 (22 Reviews)
//                   </span>
//                 </div>
//               </div>

//               <div className="product-size">
//                 <div className="d-flex">
// <p className="mb-0 fs-4 me-4">Size:</p>
// <div className="size-options">
//   {allSizes.map((size) => (
//     <button
//       key={size}
//       className={`btn me-2 mb-2 ${
//         selectedSize === size
//           ? "btn-dark text-light"
//           : "btn-outline-secondary"
//       }`}
//       onClick={() => handleSizeClick(size)}
//       disabled={!availableSizes.includes(size)}
//     >
//       {size}
//     </button>
//   ))}
// </div>
//                 </div>
//               </div>

//               <button className="btn btn-primary mt-3" onClick={handleAddToCart}>
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default SingleProduct;
