const info = (...data: any[]) => {
    console.log(`(${new Date().toUTCString()})`, ...data);
}

const error = (...data: any[]) => {
    console.error(`(${new Date().toUTCString()})`, ...data);
}

export default {
    info,
    error,
}