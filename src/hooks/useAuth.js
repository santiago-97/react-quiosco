import { useEffect } from "react"
import useSWR from "swr"
import { useNavigate } from "react-router-dom"
import clienteAxios from "../config/axios"
import useQuiosco from '../hooks/useQuiosco'

export const useAuth = ({middleware, url}) => {

    const token = localStorage.getItem('AUTH_TOKEN');
    const navigate = useNavigate();
    const { obtenerCategorias } = useQuiosco();

    const { data: user, error, mutate } = useSWR(token ? '/api/user' : null, () => 
        clienteAxios('/api/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.data)
        .catch(error => {
            throw Error(error?.response?.data?.errors)
        })
    );

    const login = async (datos, setErrores) => {

        try {
            const { data } = await clienteAxios.post('/api/login', datos)
            localStorage.setItem('AUTH_TOKEN', data.token)
            setErrores([])
            await mutate()
            await obtenerCategorias()
        } catch (error) {
            setErrores(Object.values(error.response?.data?.errors ?? {}))
        }

    }

    const registro = async (datos, setErrores) => {
        try {
            const { data } = await clienteAxios.post('/api/registro', datos)
            localStorage.setItem('AUTH_TOKEN', data.token);
            setErrores([])
            await mutate()
            await obtenerCategorias()
        } catch (error) {
            setErrores(Object.values(error.response?.data?.errors ?? {}))
        }
    }

    // Cerramos Sesion desde el backend, eliminado el token y tambien quitando el token del localStorage
    // Debemos remover el token del localStorage tambien ya que si solo lo borramos de la base de datos, en el front
    // se seguira teniendo el token, eso hara que la sesion se abra y se cierre en forma de bucle infinito 
    const logout = async () => {
        try {
            await clienteAxios.post('/api/logout', null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            localStorage.removeItem('AUTH_TOKEN')
            await mutate(undefined)
        } catch (error) {
            throw Error(error?.response?.data?.errors)
        }
    }

    // Estara escuchando los cambios en user y error
    useEffect(() => {
        if(middleware === 'guest' && url && user) {
            // Redireccionamos al usuario invitado que ya inicio sesion y ya no es invitado a la url que se esta 
            // pasando junto al middleware y url llamado desde Login.jsx
            navigate(url)
        }
        if (middleware === 'guest' && user && user.admin) {
            navigate('/admin')
        }
        if (middleware === 'admin' && user && !user.admin) {
            navigate('/')
        }
        if(middleware === 'auth' && error) {
            navigate('/auth/login')
        }
        if(middleware === 'auth' && !token) {
            navigate('/auth/login')
        }
    }, [user, error])

    return {
        login,
        registro,
        logout,
        user,
        error
    }
}