import Events from '../Events.js';
import {constants} from "../../require-global";

describe('Test events calls', ()=>{

    let events;
    const busFn1 = data => data.busFn1 = true;
    const busFn2 = data => data.busFn2 = true;
    beforeEach(() => events = new Events());

    test('Check if events get registered - using on', ()=>{
         events.subscribe('myevent', busFn1);
         events.subscribe('myevent', busFn2);
         expect(events.register.myevent.length).toBe(2);
    });

    test('Check if events can get executed with 1 function', ()=>{
        events.subscribe('myevent', busFn1);
        const evtPayload = {};
        events.publish('myevent', evtPayload);
        expect(evtPayload.busFn1).toBeDefined();
    });

    test('Check if events with multiple functions', ()=>{
        events.subscribe('myevent', busFn1);
        events.subscribe('myevent', busFn2);
        const evtPayload = {};
        events.publish('myevent', evtPayload);
        expect(evtPayload.busFn1).toBeDefined();
        expect(evtPayload.busFn2).toBeDefined();
    });

    test('Check if event-functions can get unsubscribed', ()=>{
        const evt1 = events.subscribe('myevent', busFn1);
        events.subscribe('myevent', busFn2);
        events.unsubscribe(evt1);
        const evtPayload = {};
        events.publish('myevent', evtPayload);
        expect(evtPayload.busFn1).toBeUndefined();
        expect(evtPayload.busFn2).toBeDefined();
    });

    test('Check if events can be completely removed', ()=>{
        events.subscribe('myevent', busFn1);
        events.subscribe('myevent', busFn2);
        events.unsubscribe('myevent');
        const evtPayload = {};
        events.publish('myevent', evtPayload);
        expect(evtPayload.busFn1).toBeUndefined();
        expect(evtPayload.busFn2).toBeUndefined();
    });

    test('Check if invalid unsubsribes do silently fail', ()=>{
        global.console = {warn: jest.fn()};
        events.unsubscribe({thisShouldNotWork: true});
        expect(console.warn).toBeCalled();
    });

    test('Check if non-functions get ignored', ()=>{
        events.subscribe('myevent', {thisShouldNotExecute: true});
        events.subscribe('myevent', busFn1);
        const evtPayload = {};
        events.publish('myevent', evtPayload);
        expect(evtPayload.busFn1).toBeDefined();
    });

    test('Check if errors in the bus, do not stop next functions to run', ()=>{
        global.console = {error: jest.fn()};
        events.subscribe('myevent', data => {throw 'If you are happy and you know it, system error!!'});
        events.subscribe('myevent', busFn1);
        const evtPayload = {};
        events.publish('myevent', evtPayload);
        expect(console.error).toBeCalled();
        expect(evtPayload.busFn1).toBeDefined();
    });

    test('Add wiretap to spy on all events', ()=>{
        const wireTap = jest.fn();
        events.addWireTap(wireTap);
        events.publish('myevent', {foo:'bar'});
        events.publish('myevent2', {foo2:'bar2'});
        expect(wireTap.mock.calls).toMatchSnapshot();
    })

    test('Check if only function can be added to the wiretaps', ()=>{
        events.addWireTap({foo:'bar'});
        expect(events.register[constants.events.wireTapEventName]).toBeUndefined();
        events.addWireTap(()=>{});
        expect(events.register[constants.events.wireTapEventName]).toBeDefined();
    })

});