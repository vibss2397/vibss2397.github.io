var json = {
    "Round Robin":{
        "config":{
            "Time Slice": [5, "Enter a value(in sec)"],
            "Context Switch": [1, "Enter a value(in sec)"] 
        },
        "dynamic" : 1,
        "TCB":["Id", "Arrival", "Duration"],
        "Process_list": []
    },
    "Rate Monotonic":{
        "config":{
            "Current Utilization":["Will be decided after adding processes"],
            "Combined Period": ["Will be decided when adding processes"]
        },
        "dynamic": 0,
        "TCB":["Id", "Period", "Duration"],
        "Process_list": []

    },
    "Earliest Deadline":{
        "config":{
            "Current Utilization": ["Will be decided when adding processes"],
            "Combined Period": ["Will be decided when adding processes"]
        },
        "dynamic": 1,
        "TCB":["Id", "Period", "Duration"],
        "Process_list": []
    },
    "waiting": [],
    "ready": [],
    "suspended":[]

}