const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => { 
    const defaultAccount = accounts[0]
    let user1 = accounts[1]
    let user2 = accounts[2]
    let randomMaliciousUser = accounts[3]
    
    let starId = 1
    let starPrice = web3.toWei(.01, "ether")
    let name = 'awesome star!'
    let starStory = "this star was bought for my wife's birthday"
    let ra = "11 22 10"
    let dec = "01 03 22"
    let mag = "5"

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: defaultAccount})
    })
    
    describe('can create a star', () => { 
        it('can create a star and get its name', async function () { 
            let bola = await this.contract.createStar(
            name,
            starStory,
            ra,
            dec,
            mag,
            starId, 
            {from: accounts[0]}
            )
            starInfo = await this.contract.tokenIdToStarInfo(1)
            assert.equal(starInfo[0], "awesome star!")
            assert.equal(starInfo[1], "this star was bought for my wife's birthday")
            assert.equal(starInfo[2], "11 22 10")
            assert.equal(starInfo[3], "01 03 22")
            assert.equal(starInfo[4], "5")
            assert.equal(starInfo[5], 1)
        })
        it('cannot create two equal stars', async function () { 
            await this.contract.createStar(name, starStory, ra, dec, mag, starId, {from: accounts[0]})
            let err = null
            try {
                await this.contract.createStar(name, starStory, ra, dec, mag, starId, {from: accounts[1]})
            } catch (error) {
            err = error
            }
            assert.ok(err instanceof Error)
            starInfo = await this.contract.tokenIdToStarInfo(1)
            starInfo2 = await this.contract.tokenIdToStarInfo(2)
            assert.notEqual(starInfo, starInfo2)
        })
        it('only stars unique stars can be minted even if their ID is different', async function() { 
            await this.contract.createStar(name, starStory, ra, dec, mag, 1, {from: accounts[0]})
            let err = null
            try {
                await this.contract.createStar(name, starStory, ra, dec, mag, 2, {from: accounts[1]})
            } catch (error) {
            err = error
            }
            assert.ok(err instanceof Error)
            starInfo = await this.contract.tokenIdToStarInfo(1)
            starInfo2 = await this.contract.tokenIdToStarInfo(2)
            assert.notEqual(starInfo, starInfo2)
        })
        it('minting unique stars does not fail', async function() { 
            for(let i = 0; i < 10; i ++) { 
                let id = i
                let newRa = i.toString()
                let newDec = i.toString()
                let newMag = i.toString()

                await this.contract.createStar(name, starStory, newRa, newDec, newMag, id, {from: user1})

                let starInfo = await this.contract.tokenIdToStarInfo(id)
                assert.equal(starInfo[0], name)
            }
        })
    })

    describe('buying and selling stars', () => { 
        let starPrice = web3.toWei(.01, "ether")

        beforeEach(async function () { 
            await this.contract.createStar('awesome star!', starStory, ra, dec, mag, 1, {from: user1})
        })

        it('user1 can put up their star for sale', async function () { 
           assert.equal(await this.contract.ownerOf(starId), user1)
           await this.contract.putStarUpForSale(starId, starPrice, {from: user1}) 
           assert.equal(await this.contract.starsForSale(starId), starPrice)
        })

        describe('user2 can buy a star that was put up for sale', () => { 
            beforeEach(async function () { 
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            })
            it('user2 is the owner of the star after they buy it', async function() { 
                await this.contract.buyStar(starId, {from: user2, value: starPrice, gasPrice: 0})
                assert.equal(await this.contract.ownerOf(starId), user2)
            })

            it('user2 ether balance changed correctly', async function () { 
                let overpaidAmount = web3.toWei(.05, 'ether')
                const balanceBeforeTransaction = web3.eth.getBalance(user2)
                await this.contract.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice: 0})
                const balanceAfterTransaction = web3.eth.getBalance(user2)
                assert.equal(balanceBeforeTransaction.sub(balanceAfterTransaction), starPrice)
            })
        })
    })
})