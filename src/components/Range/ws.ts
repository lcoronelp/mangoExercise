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
            if (!json.rangeItems || json.rangeItems.length < 2) {
                throw new Error("The webservice don't return the minimum data to work")
            }

            const rangeItems = json.rangeItems
            rangeItems.sort((a: number, b: number) => a - b)

            return {
                locale: json.locale ?? "en",
                decimalPositions: json.decimalPositions ?? 2,

                currency: json.currency ?? "€",
                currencyOnLeft: json.currenctyOnLeft ?? false,

                type: json.rangeItems.length === 2 ? "simple" : "multiple",
                editable: json.rangeItems.length === 2,
                rangeItems: rangeItems
            }
        })
        .catch((error) => {
            throw(error)
        })
}
