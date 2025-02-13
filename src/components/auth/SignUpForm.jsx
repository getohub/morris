import './../../App.css';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

const API_URL = import.meta.env.VITE_API_URL;
const URL_FRONT = import.meta.env.VITE_URL_FRONT;
const heading = "Inscription au jeu";

const validationSchema = Yup.object().shape({
    firstname: Yup.string().required('Ce champ est requis'),
    lastname: Yup.string().required('Ce champ est requis'),
    username: Yup.string().required("Nom d'utilisateur requis"),
    email: Yup.string().email('Email invalide').required('Ce champ est requis'),
    password: Yup.string().min(6, 'Le mot de passe est trop court').required('Ce champ est requis'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
        .required('Ce champ est requis'),
});

function SignUpForm({ toggleForm }) {
    const navigate = useNavigate();
    
        SignUpForm.propTypes = {
            toggleForm: PropTypes.func.isRequired,
        };
    return (
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg text-center">
                <h1 className="text-2xl font-bold sm:text-3xl">{heading}</h1>
                <p className="mt-4 text-gray-500">
                    Inscrivez-vous pour jouer !
                </p>
            </div>
            <Formik
                initialValues={{
                    firstname: '',
                    lastname: '',
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    try {
                        const response = await axios.post(`${API_URL}/register`, values);
                        if (response.status === 200) {
                            alert('Inscription réussie, veuillez vérifier votre boîte mail pour activer votre compte');
                            navigate('/auth/login');
                        }
                    } catch (error) {
                        console.error('Erreur lors de l\'inscription');
                        alert('Erreur lors de l\'inscription');
                    }
                }}
            >
                {({ errors, touched }) => (
                    <Form className="mx-auto mb-0 mt-8 max-w-md space-y-4">
                        <div>
                            <label htmlFor="firstname" className="sr-only">Prénom</label>
                            <div className="relative">
                                <Field
                                    id="firstname"
                                    name="firstname"
                                    placeholder="Jane"
                                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                />
                                {errors.firstname && touched.firstname ? (
                                    <div className="text-red-500 text-sm">{errors.firstname}</div>
                                ) : null}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="lastname" className="sr-only">Nom</label>
                            <div className="relative">
                                <Field
                                    id="lastname"
                                    name="lastname"
                                    placeholder="Doe"
                                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                />
                                {errors.lastname && touched.lastname ? (
                                    <div className="text-red-500 text-sm">{errors.lastname}</div>
                                ) : null}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="username" className="sr-only">Nom d'utilisateur</label>
                            <div className="relative">
                                <Field
                                    id="username"
                                    name="username"
                                    placeholder="janeDoe"
                                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                />
                                {errors.username && touched.username ? (
                                    <div className="text-red-500 text-sm">{errors.username}</div>
                                ) : null}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <div className="relative">
                                <Field
                                    id="email"
                                    name="email"
                                    placeholder="jane@acme.com"
                                    type="email"
                                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                />
                                {errors.email && touched.email ? (
                                    <div className="text-red-500 text-sm">{errors.email}</div>
                                ) : null}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">Mot de passe</label>
                            <div className="relative">
                                <Field
                                    id="password"
                                    name="password"
                                    placeholder="Mot de passe"
                                    type="password"
                                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                />
                                {errors.password && touched.password ? (
                                    <div className="text-red-500 text-sm">{errors.password}</div>
                                ) : null}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">Confirmez le mot de passe</label>
                            <div className="relative">
                                <Field
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirmez le mot de passe"
                                    type="password"
                                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                />
                                {errors.confirmPassword && touched.confirmPassword ? (
                                    <div className="text-red-500 text-sm">{errors.confirmPassword}</div>
                                ) : null}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 w-full">
                                    Vous avez un compte ?
                                <Link to="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                                    Se connecter
                                </Link>
                            </p>   
                        </div>                  
                        <div>
                            <button type="submit" className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white w-full">
                                Inscription
                            </button>
                            <Link to="/" className='font-medium text-blue-600 hover:text-blue-500'>Retour à l'accueil</Link>
                        </div>    
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default SignUpForm;