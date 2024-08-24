const info = (...data: any[]) => {
    console.log(`(${new Date().toUTCString()})`, ...data);
}

export default {
    info,
}