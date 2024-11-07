import {db} from "@/drizzle/db";
import countriesByDiscount from "@/data/countryByDiscount.json";
import {CountryGroupTable, CountryTable} from "@/drizzle/schema";
import {sql} from "drizzle-orm";

 const groupCount = await updateCountryGroups();
 const countryCount = await updateCountries();

console.log(
    `Updated ${groupCount} country groups and ${countryCount} countries`
)

async function updateCountryGroups() {

    const countryGroupInsertData = countriesByDiscount.map(
        ({name, recommendedDiscountPercentage}) => {
            return {name, recommendedDiscountPercentage}
        })


    const {rowCount} = await db.insert(CountryGroupTable).values(countryGroupInsertData).onConflictDoUpdate({
        target: CountryGroupTable.name,
        set: {
            recommendedDiscountPercentage: sql.raw(`excluded.${CountryGroupTable.recommendedDiscountPercentage.name}`)
        }
    })

    console.log(`Updated ${rowCount} country groups`)

   /* revalidateDbCache({
        tag: CACHE_TAGS.countryGroups
    })*/
    return rowCount ;

}

async function updateCountries() {

       const countryGroups = await db.query.CountryGroupTable.findMany({
           columns: {id: true, name: true}
       })

    const countryInsertData = countriesByDiscount.flatMap(({countries, name: countryName}) => {

        const countryGroup = countryGroups.find(group => group.name === countryName);

        if (!countryGroup) {
            console.error(`Could not find country group for ${countryName}`)
            return []
        }

        return countries.map(country => {
            return {
                name: country.countryName,
                code: country.country,
                countryGroupId: countryGroup.id
            }
        })
    })

    const {rowCount} = await db.insert(CountryTable).values(countryInsertData).onConflictDoUpdate({
        target: CountryTable.code,
        set: {
            name: sql.raw(`excluded.${CountryTable.name.name}`),
            countryGroupId: sql.raw(`excluded.${CountryTable.countryGroupId.name}`)
        }
    })


    console.log(`Updated ${rowCount} countries`)

       /* revalidateDbCache({
            tag: CACHE_TAGS.countries
        })*/
        return rowCount ;
}