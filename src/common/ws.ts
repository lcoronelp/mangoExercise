const baseUrl = process.env.FAKE_API_BASE_URL

const basicRequestOptions: any = {
    headers: {
        'Authorization': 'Basic d29ybGRsaW5lOndoYXRzYXBw',
        'Content-Type': 'application/json'
    }
}

export const getConfig = async (type: string) => {
    let url = `${baseUrl}/${type}`

    return fetch(url, basicRequestOptions)
        .then(res => res.json())
        .then(json => {
            const data: any = {
                locale: json.locale ?? "en",
                decimalPositions: json.decimalPositions ?? 2,

                currency: json.currency ?? "€",
                currencyOnLeft: json.currenctyOnLeft ?? false,

                rangeItems: json.rangeItems
            }

            return data

        })
        .catch((error) => {
            console.error(error)
            return {
                error: error.toString()
            }
        })
}
