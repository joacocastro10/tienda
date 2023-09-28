const url = "./JSON/productos.json";


async function obtenerProductos(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
//CONSTANTES 
const contenedorTarjetas = document.querySelector("#container-product");
const verCarrito = document.querySelector(".ver-carrito");
const modalContainer = document.getElementById("modal-container");
const cantidadCarrito = document.getElementById("cantidadCarrito");

let productosDelCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

//FUNCION PRODUCTOS EN PANTALLA Y ME CREA LAS CARDS
function mostrarProductos() {
  obtenerProductos("./JSON/productos.json")
    .then((productos) => {
      productos.forEach((prod) => {
        
        let tarjetas = document.createElement("div");
        tarjetas.className = "product";

        tarjetas.innerHTML = `<figure>
      <img src="${prod.imagen}"  />
    </figure>
    <div class="info-product">
      <h2>${prod.marca}</h2>
      <p class="precio">$${prod.precio}</p>
      <button class="boton-añadir-carrito" id=${prod.id}>Añadir al carrito</button>
    </div>
    `;
        contenedorTarjetas.appendChild(tarjetas);
  
        const botonAlCarrito = document.getElementById(`${prod.id}`);
        botonAlCarrito.addEventListener("click", agregarAlCarrito);
      });
    })
    .catch((error) => {
      console.error("Error al cargar los datos de productos:", error);
    });
}

//FUNCION QUE ME AGREGA LOS PRODUCTOS AL CARRITO
function agregarAlCarrito(e) {
  const id = e.target.id;
  
  obtenerProductos("./JSON/productos.json").then((productos) => {
    const prodEncont = productos.find((p) => p.id === parseInt(id));
    
    const repeat = productosDelCarrito.some(
      (repeatProduct) => repeatProduct.id === prodEncont.id
    );
    console.log(repeat);
      //IF TERNARIO QUE HACE QUE SI EL REPEAT DA TRUE NO ME LO VUELVA A MANDAR TODO EL OBJETO SINO QUE LE CAMBIE LA PROPIEDAD CANTIDAD Y LE SUME 1
    repeat
      ? productosDelCarrito.forEach((prod) => {
          if (prod.id === prodEncont.id) {
            prod.cantidad++;
          }
        })
      : (productosDelCarrito.push(prodEncont),
        console.log("productos del carrito"),
        console.log(productosDelCarrito));
    //INVOCO FUNCIONES: 1° EL CONTADOR ROJITO DEL ICONO. 2° FUNCION PARA GUARDAR EL LOCAL STORAGE. 3° UN TOASTIFY QUE CADA VEZ Q AGREGO UN PRODUCTO SALE UN ALERT Q AVISA
    llenarCarrito();
    carritoContador();
    saveLocal();
    Toastify({
      text: "producto agregado al carrito!",
      duration: 2000,
      position: "left",
    }).showToast();
  });
}

const llenarCarrito = () => {

  modalContainer.innerHTML = "";

  modalContainer.style.display = "flex";

  if (productosDelCarrito.length === 0) {
    const carritoVacio = document.createElement("h3");
    const carritoVacioMensaje = document.createElement("p");
  
    carritoVacio.innerText = "X";
    carritoVacio.className = "carrito-vacio-button"
    carritoVacioMensaje.innerText = "agrega productos a tu carrito para continuar";
    carritoVacioMensaje.className = "carrito-vacio-mensaje";

    carritoVacio.addEventListener("click", () => {
      modalContainer.style.display = "none";
    });


    modalContainer.appendChild(carritoVacio)
    modalContainer.appendChild(carritoVacioMensaje);
    return;
  }


  //VOY CREANDO EL MODAL Y AGREGANDOLE SU CONTENIDO
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalHeader.innerHTML = `
      <h1 class = "modal-header-title">Carrito</h1>
       `;

  modalContainer.append(modalHeader);

  const modalButton = document.createElement("h3");
  modalButton.innerText = "X";
  modalButton.className = "modal-header-button";

  modalButton.addEventListener("click", () => {
    modalContainer.style.display = "none";
  });

  modalHeader.append(modalButton);
//HAGO UN FOR EACH PARA QUE EN ESA RECORRIDA ME TRAIGA LA INFO QUE QUIERO MOSTRAR EN EL CARRITO,ES DECIR MARCA CANTIDAD PRECIO Y LUEEEGO EL TOTAL
  productosDelCarrito.forEach((producto) => {
    let carritoContenido = document.createElement("div");
    carritoContenido.className = "modal-content";
    carritoContenido.innerHTML = `
      <h3>${producto.marca}</h3>
      <p>Cantidad :${producto.cantidad}</p> 
      <p>Importe : ${producto.cantidad * producto.precio}</p>
      <span class="eliminar-producto">❌</span>
       `;

    modalContainer.append(carritoContenido);
    //CAPTURO EL BOTON PARA ELIMINAR EL PRODUCTO, LE PASO EL EVENTO CLICK PARA QUE CUANDO PASE ESTE EVENTO SE EJECUTE LA FUNCION
    let eliminar = carritoContenido.querySelector(".eliminar-producto");
    eliminar.addEventListener("click", () => {
      eliminarProducto(producto.id);
    });
  });
// CUENTA TOTAL DE LA COMPRA
  const total = productosDelCarrito.reduce(
    (acc, el) => acc + el.precio * el.cantidad,
    0
  );

  const totalCompra = document.createElement("div");
  totalCompra.className = "total-compra";
  totalCompra.innerHTML = `Total a pagar : ${total} $`;
  modalContainer.append(totalCompra);
};

verCarrito.addEventListener("click", llenarCarrito);

//ELIMINA EL PRODUCTO
const eliminarProducto = (id) => {
  const buscarId = productosDelCarrito.find((element) => element.id === id);
//ELIMINAR EL PRODUCTO DESEADO Y NO EL PRIMERO DE LA LISTA
  productosDelCarrito = productosDelCarrito.filter((carritoId) => {
    return carritoId !== buscarId;
  });

  carritoContador();
  saveLocal();
  llenarCarrito();
};

const carritoContador = () => {
  cantidadCarrito.style.display = "block";

  const carritoLength = productosDelCarrito.length;

  localStorage.setItem("carritoLength", JSON.stringify(carritoLength));

  cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoLength"));
};

//FUNCION PARA ALMACENAR LOS PRODUCTOS DEL CARRITO EN EL LOCAL STORAGE
const saveLocal = () => {
  localStorage.setItem("carrito", JSON.stringify(productosDelCarrito));
};



//  FUNCIONES
mostrarProductos();
carritoContador();