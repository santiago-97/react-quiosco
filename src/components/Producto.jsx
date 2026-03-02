import { formatearDinero } from "../helpers" 
import useQuiosco from "../hooks/useQuiosco"

export default function Producto({producto, botonAgregar = false, botonDisponible = false}) {

    const { handleClickModal, handleSetProducto, handleClickProductoAgotado } = useQuiosco();
    const { nombre, imagen, precio } = producto

    return (
        <div className="bolder p-3 shadow bg-white">
            <img
                className="w-full"
                src={`/img/${imagen}.jpg`}
                alt={`imagen ${nombre}`}
                />
            
            <div className="p-5">
                <h3 className="text-2xl font-bold">{nombre}</h3>
                <p className="text-4xl mt-5 font-black text-amber-500">
                    {formatearDinero(precio)}
                </p>

                {botonAgregar && (
                    <button
                        className="bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p-3 uppercase font-bold cursor-pointer"
                        type="button"
                        onClick={() => {
                            handleClickModal()
                            handleSetProducto(producto)
                        }}
                        >
                        Agregar
                    </button>
                )}

                {botonDisponible && (
                    <button
                        className="bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p-3 uppercase font-bold cursor-pointer"
                        type="button"
                        onClick={() => handleClickProductoAgotado(producto.id)}
                        >
                        Producto Agotado
                    </button>
                )}

            </div>
        </div>
    )
}
