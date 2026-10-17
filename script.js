const products=[
{id:1,name:"Premium Basmati Rice",category:"grains",price:480,icon:"🍚",tag:"Popular"},{id:2,name:"Whole Wheat Flour",category:"grains",price:220,icon:"🌾",tag:"Daily Use"},{id:3,name:"Corn Flour",category:"grains",price:180,icon:"🌽",tag:"Kitchen"},{id:4,name:"Masoor Daal",category:"pulses",price:310,icon:"🫘",tag:"Fresh"},{id:5,name:"Chana Daal",category:"pulses",price:295,icon:"🟡",tag:"Popular"},{id:6,name:"Cooking Oil",category:"cooking",price:620,icon:"🫗",tag:"Essential"},{id:7,name:"Sugar",category:"cooking",price:190,icon:"🧂",tag:"Daily Use"},{id:8,name:"Mixed Spices",category:"cooking",price:160,icon:"🌶️",tag:"Flavor"},{id:9,name:"Family Shampoo",category:"personal-care",price:450,icon:"🧴",tag:"Care"},{id:10,name:"Bath Soap",category:"personal-care",price:120,icon:"🧼",tag:"Fresh"},{id:11,name:"Laundry Detergent",category:"cleaning",price:390,icon:"🧺",tag:"Home Care"},{id:12,name:"Dishwashing Bar",category:"cleaning",price:100,icon:"🧽",tag:"Home Care"},{id:13,name:"Healthy Oats",category:"breakfast",price:350,icon:"🥣",tag:"Breakfast"},{id:14,name:"Tea Pack",category:"breakfast",price:520,icon:"🍵",tag:"Favorite"},{id:15,name:"Tea Biscuits",category:"snacks",price:120,icon:"🍪",tag:"Snack"},{id:16,name:"Potato Chips",category:"snacks",price:90,icon:"🥔",tag:"Snack"}
];
let selectedCategory="all",searchText="",cart=[],currentLocation="",toastTimer;
const $=id=>document.getElementById(id), productGrid=$("productGrid"), searchInput=$("searchInput"), cartBtn=$("cartBtn"), cartCount=$("cartCount"), cartDrawer=$("cartDrawer"), pageOverlay=$("pageOverlay");
const formatPrice=p=>`Rs. ${p.toLocaleString()}`;

function renderProducts(){
 const filtered=products.filter(p=>(selectedCategory==="all"||p.category===selectedCategory)&&p.name.toLowerCase().includes(searchText.toLowerCase()));
 productGrid.innerHTML=filtered.map(p=>`<article class="product-card"><div class="product-art"><span class="product-tag">${p.tag}</span><span class="product-emoji">${p.icon}</span></div><div class="product-info"><small>${p.category.replace("-"," ")}</small><h3>${p.name}</h3><div class="product-bottom"><span class="price">${formatPrice(p.price)}</span><button class="add-btn" data-id="${p.id}" aria-label="Add ${p.name}">+</button></div></div></article>`).join("")||"<p>No products found.</p>";
 $("productMessage").textContent=`Showing ${filtered.length} product${filtered.length===1?"":"s"}.`;
 document.querySelectorAll(".add-btn").forEach(btn=>btn.addEventListener("click",e=>addToCart(Number(btn.dataset.id),e.currentTarget)));
}

document.querySelectorAll(".category-card").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll(".category-card").forEach(b=>b.classList.remove("active"));button.classList.add("active");selectedCategory=button.dataset.category;renderProducts();$("products").scrollIntoView({behavior:"smooth"})}));
searchInput.addEventListener("input",e=>{searchText=e.target.value.trim();selectedCategory="all";document.querySelectorAll(".category-card").forEach(b=>b.classList.toggle("active",b.dataset.category==="all"));renderProducts()});
$("showAllBtn").addEventListener("click",()=>{selectedCategory="all";searchText="";searchInput.value="";document.querySelectorAll(".category-card").forEach(b=>b.classList.toggle("active",b.dataset.category==="all"));renderProducts()});

function addToCart(id,button){
 const product=products.find(p=>p.id===id); cart.push(product); renderCart();
 button.classList.add("added"); setTimeout(()=>button.classList.remove("added"),650);
 flyToCart(product,button); bounceCart(); showToast(product);
}
function flyToCart(product,button){
 const start=button.getBoundingClientRect(),end=cartBtn.getBoundingClientRect();
 const flyer=document.createElement("div"); flyer.className="fly-product"; flyer.textContent=product.icon; flyer.style.left=`${start.left}px`; flyer.style.top=`${start.top}px`; document.body.appendChild(flyer);
 const x=end.left-start.left+(end.width/2), y=end.top-start.top+(end.height/2);
 const anim=flyer.animate([{transform:"translate(0,0) scale(1)",opacity:1},{transform:`translate(${x*.55}px,${y*.25-80}px) scale(.9)`,opacity:1,offset:.45},{transform:`translate(${x}px,${y}px) scale(.25)`,opacity:.3}],{duration:700,easing:"cubic-bezier(.25,.8,.25,1)"});
 anim.onfinish=()=>flyer.remove();
}
function bounceCart(){cartBtn.classList.remove("cart-bounce");void cartBtn.offsetWidth;cartBtn.classList.add("cart-bounce")}
function showToast(product){$("toastProduct").textContent=product.name;$("cartToast").classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("cartToast").classList.remove("show"),1800)}
function removeFromCart(i){cart.splice(i,1);renderCart()}
window.removeFromCart=removeFromCart;
function renderCart(){
 cartCount.textContent=cart.length;
 if(!cart.length){$("cartItems").innerHTML='<p class="empty-cart">Your cart is empty.</p>';$("cartTotal").textContent="Rs. 0";return}
 $("cartItems").innerHTML=cart.map((p,i)=>`<div class="cart-item"><div class="cart-item-icon">${p.icon}</div><div><strong>${p.name}</strong><small>${formatPrice(p.price)}</small></div><button class="remove-item" onclick="removeFromCart(${i})">×</button></div>`).join("");
 $("cartTotal").textContent=formatPrice(cart.reduce((s,p)=>s+p.price,0));
}
function openCart(){cartDrawer.classList.add("open");pageOverlay.classList.add("show")}
function closeCart(){cartDrawer.classList.remove("open");pageOverlay.classList.remove("show")}
cartBtn.addEventListener("click",openCart);$("closeCart").addEventListener("click",closeCart);pageOverlay.addEventListener("click",closeCart);

const locationModal=$("locationModal"),customerName=$("customerName"),customerPhone=$("customerPhone"),deliveryAddress=$("deliveryAddress"),locationStatus=$("locationStatus");
$("checkoutBtn").addEventListener("click",()=>{if(!cart.length)return alert("Please add some products first.");closeCart();setTimeout(()=>{locationModal.classList.add("show");deliveryAddress.focus()},180)});
$("closeLocation").addEventListener("click",()=>locationModal.classList.remove("show"));
$("useLocationBtn").addEventListener("click",()=>{
 if(!navigator.geolocation){locationStatus.textContent="Location is not supported by this browser.";return}
 locationStatus.textContent="Getting your location...";
 navigator.geolocation.getCurrentPosition(pos=>{const{latitude,longitude}=pos.coords;currentLocation=`https://www.google.com/maps?q=${latitude},${longitude}`;deliveryAddress.value="Current location selected (GPS).";locationStatus.textContent="✓ Current location added."},()=>locationStatus.textContent="Could not get location. Please enter your address manually.");
});

function createConfetti(){
 const layer=$("confettiLayer");layer.innerHTML="";const colors=["#e9b43d","#0b6b46","#f08b4c","#fff","#79c89c"];
 for(let i=0;i<42;i++){const c=document.createElement("i");c.className="confetti";c.style.left=`${Math.random()*100}%`;c.style.background=colors[i%colors.length];c.style.setProperty("--drift",`${(Math.random()-.5)*180}px`);c.style.animationDelay=`${Math.random()*.35}s`;c.style.animationDuration=`${1.35+Math.random()*.75}s`;layer.appendChild(c)}
}
function runOrderAnimation(whatsappUrl){
 const overlay=$("orderAnimation"),title=$("orderAnimationTitle"),text=$("orderAnimationText");
 title.textContent="Preparing your order...";text.textContent="Packing your grocery list for WhatsApp.";overlay.classList.remove("success");overlay.classList.add("show");
 // Opening first avoids popup blockers, then we send it to WhatsApp after the animation.
 const waWindow=window.open("about:blank","_blank");
 setTimeout(()=>{overlay.classList.add("success");title.textContent="Order ready! 🎉";text.textContent="Opening WhatsApp with your complete order...";createConfetti()},1150);
 setTimeout(()=>{if(waWindow)waWindow.location.href=whatsappUrl;else window.location.href=whatsappUrl},2100);
 setTimeout(()=>overlay.classList.remove("show","success"),2500);
}
$("sendOrderBtn").addEventListener("click",()=>{
 if(!deliveryAddress.value.trim()){alert("Please enter your delivery location or use current location.");deliveryAddress.focus();return}
 const items=cart.map(p=>`- ${p.name} (${formatPrice(p.price)})`).join("\n"),total=cart.reduce((s,p)=>s+p.price,0),name=customerName.value.trim()||"Not provided",phone=customerPhone.value.trim()||"Not provided",gps=currentLocation?`\nGPS location: ${currentLocation}`:"";
 const message=`Assalam-o-Alaikum! I want to order:\n\n${items}\n\nEstimated total: ${formatPrice(total)}\n\nCustomer name: ${name}\nPhone: ${phone}\nDelivery location: ${deliveryAddress.value.trim()}${gps}`;
 const whatsappNumber="923257716767"; // CHANGE THIS
 locationModal.classList.remove("show");runOrderAnimation(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`);
});

const menuBtn=$("menuBtn"),mainNav=$("mainNav");menuBtn.addEventListener("click",()=>{const open=mainNav.classList.toggle("open");menuBtn.textContent=open?"✕":"☰"});mainNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{mainNav.classList.remove("open");menuBtn.textContent="☰"}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
$("year").textContent=new Date().getFullYear();renderProducts();renderCart();


/* =========================================================
   PREMIUM GSAP MOTION SYSTEM
   ========================================================= */
function initPremiumMotion(){
 if(!window.gsap) return;
 document.body.classList.add("gsap-ready");
 const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 if(reduce) return;

 if(window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

 // 1) Cinematic first-load hero sequence.
 const heroTL=gsap.timeline({defaults:{ease:"power3.out"}});
 heroTL
  .fromTo(".hero-copy",{autoAlpha:0,y:42},{autoAlpha:1,y:0,duration:.85},.05)
  .fromTo(".hero-copy .eyebrow",{autoAlpha:0,x:-24},{autoAlpha:1,x:0,duration:.55},.18)
  .fromTo(".hero h1",{autoAlpha:0,y:28,scale:.97},{autoAlpha:1,y:0,scale:1,duration:.72},.25)
  .fromTo(".hero-copy>p",{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.6},.38)
  .fromTo(".hero-actions .btn",{autoAlpha:0,y:18,scale:.94},{autoAlpha:1,y:0,scale:1,duration:.5,stagger:.08},.48)
  .fromTo(".hero-points div",{autoAlpha:0,y:15},{autoAlpha:1,y:0,duration:.45,stagger:.08},.68)
  .fromTo(".hero-logo",{autoAlpha:0,scale:.72,y:36,rotation:-7},{autoAlpha:1,scale:1,y:0,rotation:2,duration:1.05,ease:"back.out(1.35)"},.18)
  .fromTo(".hero-orbit",{autoAlpha:0,scale:0,rotation:-60},{autoAlpha:1,scale:1,rotation:0,duration:.55,stagger:.09,ease:"back.out(2)"},.72)
  .fromTo(".hero-float",{autoAlpha:0,scale:.8,y:22},{autoAlpha:1,scale:1,y:0,duration:.65,stagger:.12,ease:"back.out(1.5)"},.72)
  .fromTo(".hero-glow-one,.hero-glow-two",{scale:.75,autoAlpha:0},{scale:1,autoAlpha:.4,duration:1.2,stagger:.12},.1);

 // 2) Continuous premium floating after the entrance.
 gsap.to(".hero-logo",{y:-10,rotation:-1,duration:3.6,ease:"sine.inOut",repeat:-1,yoyo:true,delay:1.25});
 gsap.to(".float-one",{y:-8,rotation:-1,duration:3.5,ease:"sine.inOut",repeat:-1,yoyo:true,delay:1.35});
 gsap.to(".float-two",{y:-10,rotation:1,duration:4.1,ease:"sine.inOut",repeat:-1,yoyo:true,delay:1.55});
 gsap.to(".float-three",{y:-7,rotation:1,duration:3.8,ease:"sine.inOut",repeat:-1,yoyo:true,delay:1.75});
 gsap.to(".orbit-one",{x:8,y:-12,rotation:12,duration:3.2,ease:"sine.inOut",repeat:-1,yoyo:true,delay:1.3});
 gsap.to(".orbit-two",{x:-7,y:10,rotation:-10,duration:3.7,ease:"sine.inOut",repeat:-1,yoyo:true,delay:1.5});
 gsap.to(".orbit-three",{x:9,y:7,rotation:8,duration:4,ease:"sine.inOut",repeat:-1,yoyo:true,delay:1.7});
 gsap.to(".orbit-four",{x:-8,y:-9,rotation:-8,duration:3.5,ease:"sine.inOut",repeat:-1,yoyo:true,delay:1.9});
 gsap.to(".hero-visual",{scale:1.012,duration:2.8,ease:"sine.inOut",repeat:-1,yoyo:true,delay:1.4});

 // 3) Scroll-driven reveals. GSAP ScrollTrigger gives us one animation system instead of many hand-written delays.
 if(window.ScrollTrigger){
  gsap.utils.toArray(".reveal:not(.hero-copy):not(.hero-visual)").forEach((el)=>{
   gsap.fromTo(el,{autoAlpha:0,y:34},{autoAlpha:1,y:0,duration:.7,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}});
  });
  gsap.fromTo(".products-section",{backgroundPosition:"0 0"},{backgroundPosition:"0 80px",ease:"none",scrollTrigger:{trigger:".products-section",start:"top bottom",end:"bottom top",scrub:true}});
 }

 // 4) Product cards animate every time the product list is rendered.
 window.animateProductCards=()=>{
  if(!window.gsap || reduce) return;
  gsap.fromTo(".product-card",{autoAlpha:0,y:28,scale:.97},{autoAlpha:1,y:0,scale:1,duration:.55,stagger:.055,ease:"power3.out",overwrite:true});
 };
 window.animateProductCards();

 // 5) Subtle magnetic buttons on desktop.
 if(window.innerWidth>900){
  document.querySelectorAll(".btn-primary,.btn-gold").forEach(btn=>{
   const moveX=gsap.quickTo(btn,"x",{duration:.35,ease:"power3.out"});
   const moveY=gsap.quickTo(btn,"y",{duration:.35,ease:"power3.out"});
   btn.addEventListener("mousemove",e=>{
    const r=btn.getBoundingClientRect();
    moveX((e.clientX-(r.left+r.width/2))*.10);
    moveY((e.clientY-(r.top+r.height/2))*.10);
   });
   btn.addEventListener("mouseleave",()=>{moveX(0);moveY(0)});
  });
 }

 // 6) Gentle pointer parallax for the hero visual.
 if(window.innerWidth>900){
  const visual=document.querySelector(".hero-visual");
  const moveX=gsap.quickTo(visual,"rotationY",{duration:.6,ease:"power3.out"});
  const moveY=gsap.quickTo(visual,"rotationX",{duration:.6,ease:"power3.out"});
  visual.addEventListener("mousemove",e=>{
   const r=visual.getBoundingClientRect();
   moveX(((e.clientX-r.left)/r.width-.5)*5);
   moveY(-((e.clientY-r.top)/r.height-.5)*5);
  });
  visual.addEventListener("mouseleave",()=>{moveX(0);moveY(0)});
 }

 // 7) Tiny cursor glow for a more premium desktop feel.
 if(window.innerWidth>900){
  const glow=document.createElement("div");glow.className="cursor-glow";document.body.appendChild(glow);
  const x=gsap.quickTo(glow,"x",{duration:.45,ease:"power3.out"}),y=gsap.quickTo(glow,"y",{duration:.45,ease:"power3.out"});
  window.addEventListener("mousemove",e=>{x(e.clientX);y(e.clientY);gsap.to(glow,{opacity:.8,duration:.25,overwrite:true})},{passive:true});
 }
}

// Re-animate newly rendered product cards after filtering/searching.
const _renderProducts=renderProducts;
renderProducts=function(){_renderProducts();if(window.animateProductCards)window.animateProductCards()};

if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",initPremiumMotion); else initPremiumMotion();
