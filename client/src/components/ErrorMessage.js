const ErrorMessage = ({error}) => {
    return ( 
        <div className="error">
            { error && <h2> {error} </h2>}
        </div>
     );
}
 
export default ErrorMessage;