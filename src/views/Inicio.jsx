import useSWR from 'swr'
import useQuiosco from '../hooks/useQuiosco'
import clienteAxios from '../config/axios'
import Producto from '../components/Producto'

export default function Inicio() {

    const { categoriaActual } = useQuiosco()

    const token = localStorage.getItem('AUTH_TOKEN')
    // Consulta SWR - Stale While Revalidate
    const fetcher = () => clienteAxios('/api/productos', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(data => data.data)
    
    const { data, error, isLoading } = useSWR('/api/productos', fetcher, { refreshInterval: 10000 })

    if(isLoading) return 'Cargando...';

    if(!categoriaActual?.id) return 'Cargando...';

    const productos = data.data.filter(producto => producto.categoria_id === categoriaActual.id)

    return (
        <>
            <h1 className='text-4xl font-black'>{categoriaActual.nombre}</h1>
            
            <p className='text-2xl my-10'>
                Elige y personaliza tu pedido a continuación
            </p>

            <div className='grid pag-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
                { productos.map( producto => (
                    <Producto
                        key={producto.imagen}
                        producto={producto}
                        botonAgregar={true}
                      />
                ))}
            </div>
        </>
    )
}
