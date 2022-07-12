const baseUrl = process.env.FAKE_API_BASE_URL

const basicRequestOptions: any = {
    headers: {
        'Authorization': 'Basic d29ybGRsaW5lOndoYXRzYXBw',
        'Content-Type': 'application/json'
    }
}

export const getConfig = async (type:string) => {
    let url = `${baseUrl}/${type}`

    return fetch(url, basicRequestOptions)
        .then(res => res.json())
        .then(json => {
            if (!json.rangeItems || json.rangeItems.length < 2) {
                throw new Error("The webservice don't return the minimum data to work")
            }

            return {
                locale: json.locale ?? "en",
                decimalPositions: json.decimalPositions ?? 2,

                currency: json.currency ?? "€",
                currencyOnLeft: json.currenctyOnLeft ?? false,

                editable: json.rangeItems.length === 2,
                rangeItems: json.rangeItems
            }
        })
        .catch((error) => {
            throw(error)
        })
}
